# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import os
import random
import time
import threading
from collections import deque

app = FastAPI(title="Absher Insight Backend")

# 1. إعدادات CORS للسماح للمتصفح بالاتصال
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# 2. مخزن بيانات محلي (In-Memory Database) للمحاكاة
# نستخدم هذا لتخزين البيانات مؤقتاً أثناء عمل السيرفر
class SystemState:
    total_events = 1250
    suspicious_events = 45
    
    # لتخزين آخر الأحداث للرسم البياني
    # نستخدم deque للاحتفاظ بآخر 7 نقاط زمنية فقط
    time_series = deque(maxlen=7)
    
    # عدادات الخدمات
    services_counts = {
        "Absher Individuals": 400, "Traffic": 300, 
        "Passport": 250, "Civil Affairs": 200, "Business": 100
    }
    
    # عدادات المواقع
    locations_counts = {
        "Riyadh": 600, "Jeddah": 400, "Dammam": 150, 
        "Makkah": 80, "London": 5, "Moscow": 2
    }

state = SystemState()

# تهيئة بيانات زمنية وهمية للبدء
now = time.time()
for i in range(7, 0, -1):
    state.time_series.append({
        "t": now - (i * 3600),
        "total": random.randint(50, 150),
        "suspicious": random.randint(0, 5)
    })

# 3. دالة تحليل التنبؤ (الذكاء الاصطناعي المحاكى)
class Event(BaseModel):
    service_type: str
    location: Optional[str] = "Riyadh"
    login_time: str
    actions_count: Optional[int] = 1

@app.post("/predict")
def predict(event: Event):
    is_suspicious = False
    probability = 0.10
    
    # --- قواعد كشف الاحتيال (Rules Engine) ---
    
    # قاعدة 1: الموقع الجغرافي
    if event.location not in ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah", "Abha", "Taif"]:
        is_suspicious = True
        probability = 0.95  # خطر جداً لدخول دولي غير متوقع
        
    # قاعدة 2: الوقت (بعد منتصف الليل)
    try:
        hour = int(event.login_time.split(":")[0])
        if 0 <= hour <= 4:
            is_suspicious = True
            probability = max(probability, 0.85)
    except:
        pass

    # قاعدة 3: عدد العمليات (روبوت)
    if event.actions_count > 20:
        is_suspicious = True
        probability = 0.99

    # تسجيل العملية في النظام لظهورها في الداشبورد
    update_stats(event.service_type, event.location, is_suspicious)

    return {
        "prediction": "Suspicious" if is_suspicious else "Normal",
        "probability": probability,
        "details": "Location mismatch" if probability > 0.9 else "Behavior anomaly"
    }

# 4. دالة تحديث الإحصائيات (تستخدم عند التنبؤ أو المحاكاة الخلفية)
def update_stats(service, location, suspicious):
    state.total_events += 1
    if suspicious:
        state.suspicious_events += 1
    
    # تحديث الخدمات
    if service in state.services_counts:
        state.services_counts[service] += 1
    
    # تحديث المواقع
    if location in state.locations_counts:
        state.locations_counts[location] += 1
        
    # تحديث السلسلة الزمنية (بشكل مبسط، نحدث آخر نقطة)
    current_point = state.time_series[-1]
    current_point["total"] += 1
    if suspicious:
        current_point["suspicious"] += 1

# 5. واجهة الداشبورد (API Stats)
@app.get("/api/stats")
def api_stats():
    # حساب النسبة
    rate = 0
    if state.total_events > 0:
        rate = round((state.suspicious_events / state.total_events) * 100, 1)

    return {
        "total_events": state.total_events,
        "suspicious_events": state.suspicious_events,
        "suspicious_rate_percent": rate,
        
        # تحويل القواميس إلى قوائم للرسم البياني
        "top_services": [[k, v] for k, v in state.services_counts.items()],
        "top_locations": [[k, v] for k, v in state.locations_counts.items()],
        
        # بيانات الرسم البياني الخطي
        "timeseries_last": list(state.time_series)
    }

# 6. محاكي الخلفية (Background Simulator)
# يقوم بزيادة الأرقام تلقائياً لكي تبدو الشاشة "حية"
def simulator_loop():
    services = list(state.services_counts.keys())
    locations = list(state.locations_counts.keys())
    
    while True:
        # محاكاة عملية عشوائية
        svc = random.choice(services)
        loc = random.choices(locations, weights=[50, 40, 5, 2, 1, 1])[0] # ترجيح المدن السعودية
        is_sus = (random.random() < 0.05) or (loc in ["London", "Moscow"])
        
        update_stats(svc, loc, is_sus)
        
        # إضافة نقطة زمنية جديدة كل فترة (محاكاة مرور الوقت)
        if random.random() < 0.01: 
            state.time_series.append({
                "t": time.time(),
                "total": random.randint(10, 50),
                "suspicious": random.randint(0, 5)
            })
            
        time.sleep(2) # تحديث كل ثانيتين

# تشغيل المحاكي في الخلفية
t = threading.Thread(target=simulator_loop, daemon=True)
t.start()

# 7. تقديم الملفات الثابتة (HTML/CSS/JS)
# تأكد أن ملفات HTML موجودة بجانب ملف main.py مباشرة
app.mount("/", StaticFiles(directory=".", html=True), name="static")

# للتشغيل:
# uvicorn main:app --reload