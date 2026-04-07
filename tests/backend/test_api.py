from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_mlops_health_endpoint_returns_expected_keys() -> None:
    response = client.get("/api/v1/mlops/health")
    assert response.status_code == 200

    body = response.json()
    assert "mAP" in body
    assert "drift_status" in body
    assert "model_version" in body
    assert "pipeline_status" in body


def test_detections_endpoint_response_shape() -> None:
    response = client.get("/api/v1/detections")
    assert response.status_code == 200

    body = response.json()
    assert "count" in body
    assert "data" in body
    assert isinstance(body["count"], int)
    assert isinstance(body["data"], list)
