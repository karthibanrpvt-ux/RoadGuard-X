import argparse
import os
import re
from pathlib import Path

import mlflow
from ultralytics import YOLO


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train YOLOv8 with MLflow tracking")
    parser.add_argument("--data", required=True, help="Path to YOLO data.yaml with train/val image folders and class names")
    parser.add_argument("--model", default="yolov8n.pt", help="Base model checkpoint")
    parser.add_argument("--epochs", type=int, default=50)
    parser.add_argument("--imgsz", type=int, default=640)
    parser.add_argument("--batch", type=int, default=16)
    parser.add_argument("--lr0", type=float, default=0.01)
    parser.add_argument("--project", default="runs/roadguard")
    parser.add_argument("--name", default="yolov8-roadguard")
    parser.add_argument("--experiment", default="roadguard-yolo")
    return parser.parse_args()


def safe_log_metrics(results: object) -> None:
    results_dict = getattr(results, "results_dict", None)
    if isinstance(results_dict, dict):
        for key, value in results_dict.items():
            if isinstance(value, (int, float)):
                # Keep only characters accepted by MLflow metric naming rules.
                safe_key = re.sub(r"[^A-Za-z0-9_\-./ ]", "_", key)
                mlflow.log_metric(safe_key, float(value))


def main() -> None:
    args = parse_args()

    tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "sqlite:///mlflow.db")
    registry_uri = os.getenv("MLFLOW_REGISTRY_URI", tracking_uri)
    mlflow.set_tracking_uri(tracking_uri)
    mlflow.set_registry_uri(registry_uri)

    mlflow.set_experiment(args.experiment)

    with mlflow.start_run(run_name=args.name):
        mlflow.log_params(
            {
                "model": args.model,
                "data": args.data,
                "epochs": args.epochs,
                "imgsz": args.imgsz,
                "batch": args.batch,
                "lr0": args.lr0,
                "project": args.project,
                "name": args.name,
            }
        )

        model = YOLO(args.model)
        results = model.train(
            data=args.data,
            epochs=args.epochs,
            imgsz=args.imgsz,
            batch=args.batch,
            lr0=args.lr0,
            project=args.project,
            name=args.name,
        )

        safe_log_metrics(results)

        save_dir = Path(getattr(results, "save_dir", ""))
        if save_dir.exists():
            mlflow.log_artifacts(str(save_dir), artifact_path="training_outputs")

        best_weights = save_dir / "weights" / "best.pt"
        if best_weights.exists():
            mlflow.log_artifact(str(best_weights), artifact_path="model")

    print("Training complete. Run 'mlflow ui --port 5000' to inspect experiments.")


if __name__ == "__main__":
    main()
