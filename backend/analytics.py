# backend/analytics.py
from collections import Counter, deque
import time

EVENT_WINDOW = 1000
events = deque(maxlen=EVENT_WINDOW)
aggregates = {
    "by_service": Counter(),
    "by_location": Counter(),
    "total_events": 0,
    "suspicious_events": 0
}
timeseries = deque(maxlen=300)

def record_event(ev: dict):
    events.append(ev)
    aggregates["total_events"] += 1
    aggregates["by_service"][ev.get("service_type","unknown")] += 1
    aggregates["by_location"][ev.get("location","unknown")] += 1
    if ev.get("suspicious", False):
        aggregates["suspicious_events"] += 1
    # append snapshot
    snapshot = {"t": time.time(), "total": aggregates["total_events"], "suspicious": aggregates["suspicious_events"]}
    timeseries.append(snapshot)

def get_stats():
    total = aggregates["total_events"]
    suspicious = aggregates["suspicious_events"]
    rate = round((suspicious/total)*100,2) if total>0 else 0.0
    return {
        "total_events": total,
        "suspicious_events": suspicious,
        "suspicious_rate_percent": rate,
        "top_services": aggregates["by_service"].most_common(6),
        "top_locations": aggregates["by_location"].most_common(6),
        "timeseries_last": list(timeseries)
    }

def get_recent_events(n:int=10):
    return list(events)[-n:]
