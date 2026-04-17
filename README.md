# RoadGuard AI Dashboard (MLOps)

Production-oriented MLOps project for road damage detection using YOLOv8, with experiment tracking, data versioning, monitoring, CI/CD automation, and an operational dashboard.

## Table Of Contents

- [Project Description](#project-description)
- [Overview](#overview)
- [Architecture](#architecture)
- [Workflow](#workflow)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Model Training And Tracking](#model-training-and-tracking)
- [Monitoring](#monitoring)
- [CI/CD And Automation](#cicd-and-automation)
- [API Quick Check](#api-quick-check)

## Project Description

RoadGuard AI Dashboard is an end-to-end MLOps platform for road damage intelligence. It is designed to help engineering teams and city operations teams detect potholes from road imagery, monitor model quality over time, and continuously improve the detection model through retraining workflows.

The project brings data, model development, deployment, and monitoring into a single operational loop:

- Data preparation and reproducible dataset processing with DVC
- YOLOv8 model training with MLflow experiment tracking
- API-based inference service for real-time or batch prediction use cases
- Web dashboard for operational visibility into model outputs and pipeline state
- Drift monitoring to detect distribution changes and trigger model maintenance
- CI/CD automation to make updates auditable, repeatable, and production-ready

### Problem Statement

Road infrastructure monitoring is often manual, expensive, and slow. Delayed detection of road damage leads to safety risks, higher repair costs, and poor maintenance planning. This project addresses that gap by enabling automated pothole detection and reliable ML operations so models can be deployed and maintained with confidence.

### Key Outcomes

- Faster identification of road damage hotspots
- Better traceability of model versions, metrics, and artifacts
- Reduced deployment friction through containerized services and workflows
- Improved model reliability via monitoring and retraining triggers

## Overview

This repository combines:

- Frontend dashboard (Vite + React + TypeScript)
- Backend inference/API service (Python)
- YOLOv8 training pipeline with MLflow tracking
- DVC-enabled reproducible data workflow
- Monitoring and drift reporting
- Containerized deployment (Docker + Compose)
- Automated CI/CD and scheduled MLOps jobs (GitHub Actions + Airflow DAG support)

## Architecture

```mermaid
flowchart LR
    A[Road Images / Dataset] --> B[Data Preparation<br/>scripts/prepare_data.py]
    B --> C[DVC Pipeline<br/>dvc.yaml]
    C --> D[YOLOv8 Training<br/>scripts/train_yolo_mlflow.py]
    D --> E[MLflow Tracking<br/>mlruns/ + mlflow.db]
    D --> F[Model Weights<br/>PotholeDetect.pt / yolov8n.pt]
    F --> G[Backend API<br/>main.py, inference.py]
    G --> H[Frontend Dashboard<br/>src/]
    G --> I[Monitoring Inputs<br/>data/monitoring/*.csv]
    I --> J[Drift Report<br/>monitoring/generate_drift_report.py]
    K[GitHub Actions<br/>CI/CD + Retrain Trigger] --> G
    L[Airflow DAG<br/>dags/yolo_retrain_dag.py] --> D
```

## Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GitHub as GitHub Actions
    participant Train as Training Pipeline
    participant MLflow as MLflow
    participant API as Backend API
    participant UI as Dashboard
    participant Mon as Monitoring

    Dev->>GitHub: Push to main / open PR
    GitHub->>GitHub: Run CI (lint, test, build)
    GitHub->>Train: Trigger retrain (manual/scheduled)
    Train->>MLflow: Log params, metrics, artifacts
    Train->>API: Publish/refresh model artifact
    API->>UI: Serve predictions + ops endpoints
    API->>Mon: Emit current inference metrics/data
    Mon->>Mon: Generate drift report
    Mon-->>Dev: Review model health and drift status
```

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Python, FastAPI-style API pattern (project-level Python API service)
- Computer Vision: Ultralytics YOLOv8
- Experiment Tracking: MLflow
- Data Versioning: DVC
- Orchestration: Apache Airflow DAG
- Monitoring: Evidently-based drift reporting workflow
- DevOps: Docker, Docker Compose, GitHub Actions

## Repository Structure

```text
src/                    Frontend app and UI components
main.py                 Backend API entry
inference.py            Inference logic
scripts/                Data prep and training scripts
monitoring/             Drift report generation
dags/                   Airflow retraining DAG
data/                   Raw/processed/monitoring datasets
dataset/                YOLO image/label dataset
mlruns/                 MLflow experiment artifacts
dvc.yaml                DVC pipeline definition
docker-compose.yml      Local multi-service orchestration
Dockerfile*             Frontend/backend container images
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- Python 3.10+
- Docker Desktop (optional but recommended)

### 2. Frontend Setup

```bash
npm install
npm run dev
```

### 3. Backend Setup

```bash
pip install -r requirements-backend.txt
python main.py
```

### 4. Full Stack With Docker Compose

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`  
Backend health: `http://localhost:8000/api/v1/mlops/health`

## Model Training And Tracking

Install MLOps dependencies and train with MLflow tracking:

```bash
pip install -r requirements-mlops.txt
python scripts/train_yolo_mlflow.py --data data.yaml --model yolov8n.pt --epochs 50 --imgsz 640
```

Run MLflow UI:

```bash
mlflow server --backend-store-uri sqlite:///mlflow.db --default-artifact-root ./mlruns --host 127.0.0.1 --port 5000
```

## Monitoring

Generate a drift report from reference vs current datasets:

```bash
python monitoring/generate_drift_report.py --reference data/monitoring/reference.csv --current data/monitoring/current.csv --output reports/data_drift_report.html
```

## CI/CD And Automation

Implemented workflows include:

- CI: lint, build, and tests on PR/push
- CD: build and deploy pipeline on main
- Scheduled/manual retrain trigger with token-based API call

Recommended GitHub repository secrets:

- `DEPLOY_WEBHOOK_URL`
- `BACKEND_BASE_URL`
- `MLOPS_API_TOKEN`

## API Quick Check

```bash
curl http://localhost:8000/api/v1/mlops/health
```

## License

Add your preferred license (MIT/Apache-2.0/proprietary) before production distribution.
