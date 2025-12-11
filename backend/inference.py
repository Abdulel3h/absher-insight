import joblib
import numpy as np
import os


def load_model(model_path: str):
    if not os.path.exists(model_path):
        return None
    return joblib.load(model_path)


def preprocess(event: dict):
    mapping = {
        "Login": 0, "RenewLicense": 1, "PassportRenewal": 2,
        "VehicleTransfer": 3, "AccountTransfer": 4, "DrivingTest": 5
    }
    service_num = mapping.get(event["service_type"], -1)
    hour = int(event["login_time"].split(":")[0])

    return np.array([[service_num, hour, event["actions_count"]]])


def predict(event: dict, model_path="backend/models/anomaly_model.pkl"):
    model = load_model(model_path)
    if model is None:
        return {"suspicious": False, "risk_score": 0.0}

    x = preprocess(event)
    result = model.predict(x)[0]
    score = float(abs(model.decision_function(x)[0]))

    return {
        "suspicious": result == -1,
        "risk_score": round(score, 3)
    }
