# Technical Decisions

| Decision | Rationale | Tradeoff |
| --- | --- | --- |
| Use FastAPI | Provides clear request schemas and quick API iteration. | Production deployment needs more security hardening. |
| Use synthetic behavior data | Keeps the public repository privacy-safe. | Synthetic data cannot prove real-world detection performance. |
| Start with rules before models | Makes suspicious activity explainable to reviewers. | Rules may miss complex behavior without later modeling. |
| Keep dashboard state in memory | Simplifies the prototype and demo flow. | State resets on restart and is not audit-ready. |
