import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import sys


def train(csv_path, model_path):
    df = pd.read_csv(csv_path)

    mapping = {
        "Login": 0, "RenewLicense": 1, "PassportRenewal": 2,
        "VehicleTransfer": 3, "AccountTransfer": 4, "DrivingTest": 5
    }

    df["service_num"] = df["service_type"].map(mapping)
    df["hour"] = df["login_time"].apply(lambda t: int(t.split(":")[0]))

    X = df[["service_num", "hour", "actions_count"]]

    model = IsolationForest(contamination=0.05)
    model.fit(X)

    joblib.dump(model, model_path)

    print(f"Model saved to: {model_path}")


if __name__ == "__main__":
    train(sys.argv[1], sys.argv[2])
