# Testing and CI

This repository uses a FastAPI test harness and GitHub Actions to validate the backend prototype.

## Local Validation

Run these commands from the repository root:

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements-dev.txt
cd ..
python -m compileall backend tests
python -m pytest tests
```

Set `ENABLE_SIMULATOR=0` during tests to avoid starting the background event simulator.

For a faster API-only test environment, use:

```bash
pip install -r backend/requirements-test.txt
python -m pytest tests
```

## CI Workflow

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`.

The workflow validates:

- Python dependency installation from `backend/requirements-test.txt`
- Python syntax for backend and test modules
- FastAPI `/predict` behavior for normal and suspicious scenarios
- `/api/stats` response fields used by the dashboard

## Current Coverage

The tests cover the active rule-based API behavior. They do not validate the optional joblib model artifacts, dashboard rendering, or simulator time-series behavior.

## Recommended Next Tests

- Add tests for malformed input and boundary login times.
- Add tests for model inference helpers if model artifacts remain in the repository.
- Add a browser smoke test for the dashboard after choosing a static-serving approach.
- Add privacy-focused tests around synthetic data handling before real data is introduced.
