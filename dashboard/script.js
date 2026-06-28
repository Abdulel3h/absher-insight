document.getElementById('eventForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    service_type: document.getElementById('service_type').value,
    login_time: document.getElementById('login_time').value,
    actions_count: parseInt(document.getElementById('actions_count').value) || 1,
    location: document.getElementById('location').value || ''
  };
  const resEl = document.getElementById('result');
  resEl.textContent = 'Analyzing...';
  try {
    const resp = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    resEl.replaceChildren();
    if (data.error) {
      const error = document.createElement('p');
      error.className = 'error';
      error.textContent = 'Error: ' + data.error;
      resEl.appendChild(error);
    } else {
      const title = document.createElement('h3');
      title.textContent = 'Result';
      const prediction = document.createElement('p');
      prediction.append('Prediction: ');
      const predictionValue = document.createElement('strong');
      predictionValue.textContent = data.prediction || 'Unknown';
      prediction.appendChild(predictionValue);
      const probability = document.createElement('p');
      probability.append('Probability: ');
      const probabilityValue = document.createElement('strong');
      probabilityValue.textContent =
        typeof data.probability === 'number' ? `${(data.probability * 100).toFixed(1)}%` : 'Unknown';
      probability.appendChild(probabilityValue);
      resEl.append(title, prediction, probability);
    }
  } catch (err) {
    resEl.replaceChildren();
    const error = document.createElement('p');
    error.className = 'error';
    error.textContent = 'Error: ' + err.message;
    resEl.appendChild(error);
  }
});
