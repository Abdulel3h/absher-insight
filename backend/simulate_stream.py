import time
import random
import requests

API_URL = "http://localhost:8000/predict"

services = ["Login", "RenewLicense", "PassportRenewal", "DrivingTest", "AccountTransfer", "VehicleTransfer"]
locations = ["Riyadh", "Jeddah", "Dammam", "Abha", "Taif", "Mecca"]
devices = ["Mobile", "PC", "Tablet"]


def generate_event():
    return {
        "service_type": random.choice(services),
        "login_time": f"{random.randint(0,23):02d}:{random.randint(0,59):02d}",
        "actions_count": random.randint(1, 20),
        "location": random.choice(locations),
        "device": random.choice(devices),
        "user_id": random.randint(1000, 9999)
    }


def stream():
    print("Streaming events...")
    while True:
        event = generate_event()
        try:
            res = requests.post(API_URL, json=event)
            print("Sent:", event, "| Response:", res.json())
        except:
            print("Error sending event")
        time.sleep(0.5)


if __name__ == "__main__":
    stream()
