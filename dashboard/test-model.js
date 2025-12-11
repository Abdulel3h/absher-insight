// test-model.js

async function predict() {
    // 1. جمع البيانات من الفورم
    const serviceType = document.getElementById("service").value;
    const locationValue = document.getElementById("location").value; // تم إضافة هذا السطر
    const timeValue = document.getElementById("time").value;
    const actionsCount = document.getElementById("actions").value;

    // التحقق من المدخلات
    if (!actionsCount) {
        alert("Please enter the number of actions.");
        return;
    }

    // تجهيز واجهة المستخدم (Loading State)
    const resultCard = document.getElementById("resultCard");
    const resultTitle = document.getElementById("resultTitle");
    const resultIcon = document.getElementById("resultIcon");
    const resultDesc = document.getElementById("resultDesc");
    const confidenceBox = document.getElementById("confidenceBox");
    
    // إعادة تعيين الحالة
    resultTitle.innerText = "Analyzing...";
    resultCard.style.opacity = "1";
    resultIcon.className = "fas fa-spinner fa-spin"; // أيقونة تحميل
    resultIcon.style.color = "#114b38";
    confidenceBox.style.display = "none";

    // تجهيز البيانات للإرسال
    const body = {
        service_type: serviceType,
        location: locationValue, // إرسال الموقع للباك إند
        login_time: timeValue,
        actions_count: Number(actionsCount)
    };

    try {
        // 2. إرسال الطلب إلى API
        // تأكد أن الباك إند يستقبل حقل location الآن
        const res = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error("API Error");

        const data = await res.json();

        // 3. عرض النتيجة
        const isSuspicious = data.prediction === "Suspicious" || data.prediction === 1;

        if (isSuspicious) {
            // حالة خطر
            resultTitle.innerText = "Suspicious Behavior Detected";
            resultTitle.style.color = "#e74c3c";
            resultDesc.innerText = `The model detected an anomaly from (${locationValue}).`; // عرض الموقع في النتيجة
            resultIcon.className = "fas fa-exclamation-triangle";
            resultIcon.style.color = "#e74c3c";
        } else {
            // حالة آمنة
            resultTitle.innerText = "Normal Behavior";
            resultTitle.style.color = "#114b38";
            resultDesc.innerText = `Safe activity detected from (${locationValue}).`;
            resultIcon.className = "fas fa-check-circle";
            resultIcon.style.color = "#114b38";
        }

        // عرض نسبة الثقة (Probability)
        if (data.probability !== undefined) {
            confidenceBox.style.display = "inline-block";
            confidenceBox.style.color = "#333";
            document.getElementById("confidenceScore").innerText = (data.probability * 100).toFixed(1) + "%";
        }

    } catch (error) {
        console.error(error);
        resultTitle.innerText = "Connection Error";
        resultTitle.style.color = "#555";
        resultDesc.innerText = "Ensure the backend server is running.";
        resultIcon.className = "fas fa-wifi"; // أيقونة واي فاي مقطوع أو تنبيه
        resultIcon.style.color = "gray";
    }
}