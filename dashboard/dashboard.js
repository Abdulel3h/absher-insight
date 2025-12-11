const API = "http://127.0.0.1:8000/api/stats";

// تعريف المتغيرات لتخزين الكائنات الخاصة بالرسوم البيانية
let charts = {
    services: null,
    times: null,
    locations: null
};

// دالة لجلب البيانات وتحديث الواجهة
async function loadStats() {
    try {
        const res = await fetch(API);
        
        // التحقق من نجاح الاتصال
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // 1. تحديث الأرقام (Cards)
        document.getElementById("totalEvents").innerText = data.total_events;
        document.getElementById("suspiciousRate").innerText = data.suspicious_rate_percent + "%";
        
        // حساب عدد العمليات المشبوهة تقريبياً إذا لم يرسله الباك-إند (بناءً على النسبة)
        // إذا كان الباك إند يرسل suspicious_events استخدمه مباشرة
        const suspiciousCount = data.suspicious_events || Math.round((data.total_events * data.suspicious_rate_percent) / 100);
        document.getElementById("suspiciousEvents").innerText = suspiciousCount;

        // يمكنك إضافة عنصر في HTML لعرض وقت التحديث إذا أردت
        // document.getElementById("lastUpdate").innerText = new Date().toLocaleTimeString();

        // 2. تحديث الرسوم البيانية
        updateCharts(data);

    } catch (error) {
        console.error("فشل جلب البيانات:", error);
        // خيار: عرض بيانات وهمية في حالة فشل الاتصال للتجربة فقط
        // useMockData(); 
    }
}

function updateCharts(data) {
    // ربط العناصر بـ HTML IDs الصحيحة
    const ctxServices = document.getElementById("chartServices").getContext("2d");
    const ctxTimes = document.getElementById("chartTimes").getContext("2d");
    const ctxLocations = document.getElementById("chartLocations").getContext("2d");

    // --- Chart 1: Services (Bar Chart) ---
    if (!charts.services) {
        charts.services = new Chart(ctxServices, {
            type: "bar", // أو "doughnut" حسب تفضيلك
            data: {
                labels: data.top_services.map(r => r[0]),
                datasets: [{ 
                    label: "عدد العمليات", 
                    data: data.top_services.map(r => r[1]),
                    backgroundColor: ['#114b38', '#1b6b50', '#2e8b57', '#3cb371', '#8fbc8f'],
                    borderRadius: 5
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    } else {
        charts.services.data.labels = data.top_services.map(r => r[0]);
        charts.services.data.datasets[0].data = data.top_services.map(r => r[1]);
        charts.services.update();
    }

    // --- Chart 2: Timeseries (Line Chart) ---
    if (!charts.times) {
        charts.times = new Chart(ctxTimes, {
            type: "line",
            data: {
                labels: data.timeseries_last.map(t => new Date(t.t * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})),
                datasets: [
                    {
                        label: "Total Events",
                        data: data.timeseries_last.map(t => t.total),
                        borderColor: "#114b38", // أخضر غامق
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: "Suspicious",
                        data: data.timeseries_last.map(t => t.suspicious),
                        borderColor: "#e74c3c", // أحمر
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: { responsive: true }
        });
    } else {
        charts.times.data.labels = data.timeseries_last.map(t => new Date(t.t * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        charts.times.data.datasets[0].data = data.timeseries_last.map(t => t.total);
        charts.times.data.datasets[1].data = data.timeseries_last.map(t => t.suspicious);
        charts.times.update();
    }

    // --- Chart 3: Locations (تحسين التصميم) ---
    if (!charts.locations) {
        charts.locations = new Chart(ctxLocations, {
            type: "doughnut",
            data: {
                labels: data.top_locations.map(r => r[0]),
                datasets: [{ 
                    label: "العمليات",
                    data: data.top_locations.map(r => r[1]),
                    backgroundColor: [
                        '#114b38', // أخضر أبشر الغامق
                        '#2e7d32', // أخضر متوسط
                        '#4caf50', // أخضر فاتح
                        '#81c784', // أخضر باهت
                        '#b9f6ca'  // أفتح درجة
                    ],
                    borderWidth: 5,        // مسافة بيضاء بين الأقسام
                    borderColor: '#ffffff', // لون الفاصل
                    borderRadius: 10,       // تدوير الحواف (Modern Look)
                    hoverOffset: 15         // عند تمرير الماوس يخرج القسم للخارج
                }]
            },
            options: { 
                responsive: true,
                maintainAspectRatio: false, // يسمح للرسم بالتمدد حسب حجم الكارد
                cutout: '75%', // يجعل الدائرة مفرغة أكثر (حلقة رفيعة)
                plugins: {
                    legend: {
                        position: 'right', // وضع الأسماء على اليمين بدلاً من الأعلى
                        labels: {
                            usePointStyle: true, // استخدام دوائر صغيرة بدلاً من مربعات
                            padding: 20,
                            font: {
                                size: 12,
                                family: "'Segoe UI', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#114b38',
                        titleColor: '#fff',
                        bodyColor: '#fff'
                    }
                }
            }
        });
    } else {
        charts.locations.data.labels = data.top_locations.map(r => r[0]);
        charts.locations.data.datasets[0].data = data.top_locations.map(r => r[1]);
        charts.locations.update();
    }
}

// تشغيل التحديث كل 3 ثواني
setInterval(loadStats, 3000);

// التحميل الأولي عند فتح الصفحة
loadStats();