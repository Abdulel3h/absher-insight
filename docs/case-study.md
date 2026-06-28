# Case Study

## Context

Absher Insight AI is a security analytics prototype for government-style digital services. It uses synthetic/in-memory data, FastAPI, rule-based suspicious-activity logic, and dashboard views.

## Problem

Digital identity services need early signals for suspicious behavior, but public portfolio work cannot expose real user data or imply production access. The project needed to demonstrate security analytics thinking with synthetic behavior only.

## Constraints

- No real citizen, government, or production data.
- Rules must be explainable to reviewers.
- The dashboard should show operational thinking without claiming deployment.
- Prototype security limits must be visible.

## Solution

The backend exposes `/predict` for behavior checks and `/api/stats` for dashboard metrics. Rules flag unusual locations, late-night access, and high action volume. The frontend dashboard visualizes current synthetic activity and risk state.

## Architecture

See [Architecture](architecture.md). The system is intentionally simple: dashboard -> FastAPI -> in-memory state -> rules engine -> stats API.

## Key Engineering Decisions

- Use synthetic and in-memory data only.
- Prefer explainable rules over opaque model claims.
- Make CORS origins configurable through `ALLOWED_ORIGINS`.
- Disable the simulator during tests with `ENABLE_SIMULATOR=0`.
- Test the FastAPI app directly with `TestClient` instead of requiring a live local server.

## Trade-Offs

- Rule-based logic is explainable but limited.
- In-memory state is useful for demos but not audit-ready.
- A live-looking dashboard can be misleading, so documentation labels it as prototype simulation.

## What I Learned

- Security projects need careful wording, explicit data boundaries, and testable interfaces.
- Recruiters value seeing what is intentionally not claimed as much as what is implemented.

## Current Limitations

- No persistent audit log.
- No authentication or authorization layer.
- No real model training/evaluation pipeline.
- CORS still requires production-specific origin configuration before deployment.

## Future Improvements

- Add a threat model.
- Add structured event schemas and persistence.
- Add more tests for malformed input and rule edge cases.
- Add privacy review notes for any future real-data version.

## Reviewer Evaluation

Inspect `backend/main.py`, `dashboard/`, `tests/test_api.py`, and the architecture doc. Evaluate whether the project separates prototype behavior from production security claims.
