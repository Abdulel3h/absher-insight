import os

os.environ["ENABLE_SIMULATOR"] = "0"

from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_predict():
    payload = {
        "service_type": "RenewLicense",
        "login_time": "10:15",
        "actions_count": 2,
    }
    resp = client.post("/predict", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "prediction" in data and "probability" in data
    assert data["prediction"] in {"Normal", "Suspicious"}
    assert 0 <= data["probability"] <= 1


def test_unusual_location_is_suspicious():
    resp = client.post("/predict", json={
        "service_type": "Passport",
        "location": "London",
        "login_time": "11:00",
        "actions_count": 2,
    })
    assert resp.status_code == 200
    assert resp.json()["prediction"] == "Suspicious"


def test_api_stats_contract():
    resp = client.get("/api/stats")
    assert resp.status_code == 200
    data = resp.json()

    expected_fields = {
        "total_events",
        "suspicious_events",
        "suspicious_rate_percent",
        "top_services",
        "top_locations",
        "timeseries_last",
    }
    assert expected_fields.issubset(data)
    assert isinstance(data["top_services"], list)
    assert isinstance(data["top_locations"], list)
    assert isinstance(data["timeseries_last"], list)
