const countryInput = document.getElementById('country');
const addVisitBtn = document.getElementById('addVisit');
const statsEl = document.getElementById('stats');

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Visits per Country',
            data: [],
            backgroundColor: 'rgba(52, 152, 219, 0.7)'
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } }
    }
});

async function isValidCountry(code) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        return res.ok;
    } catch {
        return false;
    }
}

async function fetchStats() {
    const res = await fetch('/stats');
    const data = await res.json();

    statsEl.textContent = JSON.stringify(data, null, 2);
    chart.data.labels = Object.keys(data);
    chart.data.datasets[0].data = Object.values(data);
    chart.update();
}

addVisitBtn.addEventListener('click', async () => {
    const code = countryInput.value.trim().toLowerCase();

    if (code.length !== 2) {
        alert('Country code must be 2 letters');
        return;
    }

    const valid = await isValidCountry(code);
    if (!valid) {
        alert('Invalid country code');
        return;
    }

    await fetch(`/stats/${code}`, { method: 'POST' });
    countryInput.value = '';
    fetchStats();
});

fetchStats();
setInterval(fetchStats, 5000);
