import random
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import cv2
from ultralytics import YOLO

from database import insert_detection


def get_simulated_coimbatore_gps() -> Tuple[float, float]:
    # Approximate bounding box around Coimbatore city region.
    latitude = round(random.uniform(10.95, 11.10), 6)
    longitude = round(random.uniform(76.88, 77.08), 6)
    return latitude, longitude


def _calculate_severity(area: float, confidence: float) -> str:
    score = area * confidence
    if score >= 120000:
        return "High"
    if score >= 40000:
        return "Medium"
    return "Low"


class YOLOInferenceEngine:
    def __init__(self, model_path: Optional[str] = None) -> None:
        resolved = self._resolve_model_path(model_path)
        self.model = YOLO(str(resolved))
        # CPU-tuned defaults: faster runtime with better recall for pothole classes.
        self.confidence_threshold = 0.2
        self.target_processing_fps = 8
        self.inference_imgsz = 736

    @staticmethod
    def _resolve_model_path(model_path: Optional[str]) -> Path:
        base_dir = Path(__file__).resolve().parent

        candidates: List[Path] = []
        if model_path:
            candidates.append(Path(model_path))

        # Common default model names for this project.
        candidates.extend(
            [
                base_dir / "PotholeDetect.pt",
                base_dir / "pothole_model.pt",
            ]
        )

        for candidate in candidates:
            resolved = candidate.resolve()
            if resolved.exists():
                return resolved

        # Final fallback: use the first .pt file in the backend root.
        discovered = sorted(base_dir.glob("*.pt"))
        if discovered:
            return discovered[0].resolve()

        raise FileNotFoundError(
            "No YOLO model found. Place a .pt file in the project root or set MODEL_PATH."
        )

    def process_video(self, video_path: str) -> List[Dict]:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Unable to open video file: {video_path}")

        detections: List[Dict] = []
        fps = float(cap.get(cv2.CAP_PROP_FPS) or 30.0)
        frame_stride = max(1, int(round(fps / self.target_processing_fps)))
        frame_index = 0

        try:
            while True:
                ok, frame = cap.read()
                if not ok:
                    break

                frame_height, frame_width = frame.shape[:2]

                if frame_index % frame_stride != 0:
                    frame_index += 1
                    continue

                results = self.model(
                    frame,
                    verbose=False,
                    conf=self.confidence_threshold,
                    imgsz=self.inference_imgsz,
                )
                if not results:
                    frame_index += 1
                    continue

                result = results[0]
                boxes = result.boxes
                if boxes is None:
                    frame_index += 1
                    continue

                names = result.names if isinstance(result.names, dict) else {}

                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    width = max(0.0, x2 - x1)
                    height = max(0.0, y2 - y1)
                    area = width * height

                    confidence = float(box.conf[0].item())
                    if confidence < self.confidence_threshold:
                        continue

                    class_id = int(box.cls[0].item())
                    damage_class = names.get(class_id, str(class_id))

                    severity = _calculate_severity(area=area, confidence=confidence)
                    latitude, longitude = get_simulated_coimbatore_gps()

                    insert_detection(
                        lat=latitude,
                        lon=longitude,
                        damage_class=damage_class,
                        severity=severity,
                        conf=confidence,
                    )

                    detections.append(
                        {
                            "latitude": latitude,
                            "longitude": longitude,
                            "damage_class": damage_class,
                            "severity": severity,
                            "confidence": round(confidence, 4),
                            "frame_index": frame_index,
                            "frame_time": round(frame_index / fps, 3),
                            "frame_width": int(frame_width),
                            "frame_height": int(frame_height),
                            "fps": round(fps, 3),
                            "bbox": {
                                "x1": round(float(x1), 2),
                                "y1": round(float(y1), 2),
                                "x2": round(float(x2), 2),
                                "y2": round(float(y2), 2),
                            },
                        }
                    )

                frame_index += 1
        finally:
            cap.release()

        return detections
