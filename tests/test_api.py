# test_api.py (مثال بسيط لاختبار endpoint)
import requests

def test_predict():
    payload = {
        'service_type': 'RenewLicense',
        'login_time': '10:15',
        'actions_count': 2
    }
    resp = requests.post('http://localhost:8000/predict', json=payload, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert 'suspicious' in data and 'risk_score' in data
