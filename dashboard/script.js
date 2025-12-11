document.getElementById('eventForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    service_type: document.getElementById('service_type').value,
    login_time: document.getElementById('login_time').value,
    actions_count: parseInt(document.getElementById('actions_count').value) || 1,
    location: document.getElementById('location').value || ''
  };
  const resEl = document.getElementById('result');
  resEl.innerHTML = 'Analyzing...';
  try {
    const resp = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    if (data.error) {
      resEl.innerHTML = '<p class="error">Error: ' + data.error + '</p>';
    } else {
      resEl.innerHTML = '<h3>Result</h3>' +
                        '<p>Suspicious: <strong>' + data.suspicious + '</strong></p>' +
                        '<p>Risk score: <strong>' + data.risk_score + '</strong></p>';
    }
  } catch (err) {
    resEl.innerHTML = '<p class="error">Error: ' + err.message + '</p>';
  }
});
