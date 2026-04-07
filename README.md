<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
# RoadGuard X
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d0a2fc0c-cbfe-460a-b2c2-305e23049dea

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## MLOps Setup (Implemented in this Repo)

This repository now includes ready-to-run GitHub Actions workflows:

- `.github/workflows/ci.yml`
   - Runs on pull requests and pushes to `main`
   - Frontend: `npm ci`, `npm run lint`, `npm run build`
   - Backend: installs `requirements-backend.txt` and runs API tests

- `.github/workflows/cd.yml`
   - Runs on pushes to `main` and manual trigger
   - Builds frontend and validates backend import/smoke
   - Calls a deployment webhook (you configure target)

- `.github/workflows/mlops-retrain.yml`
   - Runs weekly (Monday 02:00 UTC) and manual trigger
   - Calls `POST /api/v1/mlops/retrain` on your backend with bearer token

## Exactly What You Need To Do (One-Time)

1. Push this code to your GitHub repository.
2. Open GitHub repository settings and add these Actions secrets:
    - `DEPLOY_WEBHOOK_URL`: Your deployment endpoint webhook URL.
    - `BACKEND_BASE_URL`: Your deployed backend base URL (example: `https://api.example.com`).
    - `MLOPS_API_TOKEN`: A strong token string used to protect retrain trigger.
3. In your deployment environment, set backend env var:
    - `MLOPS_API_TOKEN` = same value used in GitHub secret.
4. Commit to `main` to trigger CI and CD automatically.
5. Open Actions tab in GitHub and confirm all jobs are green.
6. Manually run `MLOps Retrain Trigger` workflow once to verify retrain wiring.

## Backend Security Note

The retrain endpoint now checks `Authorization: Bearer <token>` only when `MLOPS_API_TOKEN` is configured.
If the env var is not set, endpoint behaves as open endpoint (local/dev convenience).
