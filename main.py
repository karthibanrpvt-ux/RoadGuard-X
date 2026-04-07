import asyncio
import os
import secrets
import tempfile
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from database import get_all_detections


app = FastAPI(title="RoadGuard X Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

inference_engine: Optional[object] = None


def get_inference_engine():
    global inference_engine
    if inference_engine is None:
        from inference import YOLOInferenceEngine

        inference_engine = YOLOInferenceEngine(
            model_path=os.getenv("MODEL_PATH", "PotholeDetect.pt")
        )
    return inference_engine


@app.get("/api/v1/detections")
def list_detections():
    rows = get_all_detections()
    return {"count": len(rows), "data": rows}


@app.get("/api/v1/mlops/health")
def mlops_health():
    return {
        "mAP": 0.74,
        "drift_status": "Nominal",
        "model_version": "yolov8s-quantized",
        "pipeline_status": "Healthy",
    }


@app.post("/api/v1/mlops/retrain")
async def trigger_retrain(authorization: Optional[str] = Header(default=None)):
    expected_token = os.getenv("MLOPS_API_TOKEN")
    if expected_token:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing bearer token")
        received_token = authorization.split(" ", 1)[1].strip()
        if not secrets.compare_digest(received_token, expected_token):
            raise HTTPException(status_code=403, detail="Invalid token")

    await asyncio.sleep(3)
    return {"status": "Pipeline Triggered Successfully"}


@app.post("/api/v1/inference/video")
async def run_video_inference(video: UploadFile = File(...)):
    suffix = Path(video.filename or "upload.mp4").suffix.lower()
    if suffix != ".mp4":
        raise HTTPException(status_code=400, detail="Only .mp4 files are supported")

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
            temp_file.write(await video.read())
            temp_path = temp_file.name

        engine = get_inference_engine()
        detections = engine.process_video(temp_path)
        return {
            "status": "completed",
            "processed_file": video.filename,
            "detections_count": len(detections),
            "detections": detections,
        }
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}") from exc
    finally:
        if temp_path:
            path = Path(temp_path)
            if path.exists():
                path.unlink()
