async function fetchStats() {
    const res = await fetch("http://localhost:8000/api/stats");
    return res.json();
}

let chartTime, chartServices, chartLocations;

async function updateDashboard() {
    const data = await fetchStats();

    document.getElementById("totalEvents").innerText = data.total_events;
    document.getElementById("suspRate").innerText = data.suspicious_rate_percent + "%";

    const last = data.timeseries_last[data.timeseries_last.length - 1];
    document.getElementById("latestEvent").innerText = 
        `Total: ${last.total} | Suspicious: ${last.suspicious}`;

    // Update charts
    chartTime.data.labels = data.timeseries_last.map(x => new Date(x.t * 1000).toLocaleTimeString());
    chartTime.data.datasets[0].data = data.timeseries_last.map(x => x.total);
    chartTime.update();

    chartServices.data.labels = data.top_services.map(x => x[0]);
    chartServices.data.datasets[0].data = data.top_services.map(x => x[1]);
    chartServices.update();

    chartLocations.data.labels = data.top_locations.map(x => x[0]);
    chartLocations.data.datasets[0].data = data.top_locations.map(x => x[1]);
    chartLocations.update();
}

window.onload = () => {
    chartTime = new Chart(document.getElementById("chartTime"), {
        type: "line",
        data: { labels: [], datasets: [{ label: "Events", data: [] }] }
    });

    chartServices = new Chart(document.getElementById("chartServices"), {
        type: "bar",
        data: { labels: [], datasets: [{ label: "Count", data: [] }] }
    });

    chartLocations = new Chart(document.getElementById("chartLocations"), {
        type: "doughnut",
        data: { labels: [], datasets: [{ label: "Count", data: [] }] }
    });

    // Auto-update
    setInterval(updateDashboard, 3000);
};
