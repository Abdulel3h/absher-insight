# Reviewer Guide

Use this guide if you are evaluating Absher Insight AI for AI security, behavioral analytics, or dashboard engineering roles.

## 30-Second Review

- Start with `README.md` for the security concept and setup.
- Open `docs/architecture.md` to understand the FastAPI, rules, and dashboard flow.
- Inspect `backend/main.py` for the `/predict` endpoint and simulation behavior.
- Inspect `backend/analytics.py` for aggregation logic.

## What This Project Demonstrates

- Privacy-aware use of synthetic behavioral data.
- Explainable suspicious-activity rules.
- FastAPI service structure.
- Dashboard-driven operational visibility.
- Honest separation between prototype analytics and production security.

## Quick Technical Path

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Prototype Boundaries

- CORS is permissive and should be restricted before deployment.
- In-memory state is useful for demos but not audit-ready.
- Real security use would require privacy review, threat modeling, and stronger tests.

## Related Repositories

- [Abdulelah AI Portfolio](https://github.com/Abdulel3h/Abdulelah)
- [Stadium Gate Monitor](https://github.com/Abdulel3h/Stadium)
