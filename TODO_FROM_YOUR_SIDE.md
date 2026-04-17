# RoadGuard X - Final Rubric Checklist (Your Actions)

## 1. One-time installs

- Install Docker Desktop and ensure `docker --version` works.
- Activate your Python venv.
- Install backend deps: `pip install -r requirements-backend.txt`
- Install MLOps deps: `pip install -r requirements-mlops.txt`

## 2. DVC setup (data versioning evidence)

- Run: `dvc init`
- Create/collect your raw dataset manifest at `data/raw/sample_manifest.csv`
- Run: `python scripts/prepare_data.py --input data/raw/sample_manifest.csv --output data/processed/manifest_clean.csv`
- Run: `dvc repro`
- Optional but best: configure DVC remote (S3/GDrive/Azure/other)
- Commit DVC files and push

## 3. MLflow experiment evidence

- Prepare a YOLO `data.yaml` file for your dataset
- Run training with tracking:
  - `python scripts/train_yolo_mlflow.py --data path/to/data.yaml --model yolov8n.pt --epochs 50 --imgsz 640`
- Start UI: `mlflow ui --port 5000`
- Take screenshot of run metrics + params for report

## 4. Docker deployment evidence

- Build image: `docker build -t roadguard-backend .`
- Run container: `docker run --rm -p 8000:8000 -e MODEL_PATH=/app/PotholeDetect.pt roadguard-backend`
- Verify endpoint: `http://localhost:8000/api/v1/mlops/health`
- Take screenshot or curl output for report

## 5. GitHub Actions secrets (required)

Add these in GitHub repo -> Settings -> Secrets and variables -> Actions:
- `DEPLOY_WEBHOOK_URL`
- `BACKEND_BASE_URL`
- `MLOPS_API_TOKEN`

Also set `MLOPS_API_TOKEN` in your deployed backend environment.

## 6. CI/CD proof

- Push to `main`
- Confirm green runs for:
  - CI workflow
  - CD workflow
- Manually run `MLOps Retrain Trigger`
- Capture screenshots of green checks

## 7. Monitoring proof (Evidently)

- Place baseline data: `data/monitoring/reference.csv`
- Place latest inference data: `data/monitoring/current.csv`
- Generate report:
  - `python monitoring/generate_drift_report.py --reference data/monitoring/reference.csv --current data/monitoring/current.csv --output reports/data_drift_report.html`
- Add generated report screenshot to final documentation

## 8. Final report package

Include screenshots/artifacts for:
- DVC pipeline and versioned data files
- MLflow experiments dashboard
- Dockerized API running
- CI/CD passing workflows
- Evidently drift report
- Architecture overview (frontend + backend + model + automation)
