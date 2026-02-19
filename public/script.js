// אלמנטים מה-HTML
const addVisitBtn = document.getElementById('addVisit');
const statsEl = document.getElementById('stats');
const countryInput = document.getElementById('country');

// הגדרת Chart.js
const ctx = document.getElementById('statsChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [], // שמות המדינות
        datasets: [{
            label: 'Visits per Country',
            data: [], // מספר ביקורים
            backgroundColor: 'rgba(52, 152, 219, 0.7)',
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// פונקציה למשיכת סטטיסטיקות מהשרת
async function fetchStats() {
    try {
        const res = await fetch('/stats');
        const data = await res.json();

        // עדכון JSON בדף
        statsEl.textContent = JSON.stringify(data, null, 2);

        // עדכון הגרף
        chart.data.labels = Object.keys(data);
        chart.data.datasets[0].data = Object.values(data);
        chart.update();
    } catch (err) {
        console.error('Error fetching stats:', err);
    }
}

// לחיצה על הכפתור להוספת ביקור
addVisitBtn.addEventListener('click', async () => {
    const country = countryInput.value.trim().toLowerCase();
    if (!country) return alert('Enter a valid 2-letter country code');

    try {
        await fetch(`/stats/${country}`, { method: 'POST' });
        countryInput.value = '';
        fetchStats();
    } catch (err) {
        console.error('Error adding visit:', err);
    }
});

// טעינת סטטיסטיקות בהתחלה
fetchStats();

// עדכון אוטומטי כל 5 שניות
setInterval(fetchStats, 5000);
