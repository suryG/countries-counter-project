const addVisitBtn = document.getElementById('addVisit');
const statsEl = document.getElementById('stats');
const countryInput = document.getElementById('country');

// קביעת כתובת ה-API באופן אוטומטי בהתאם לסביבת ההרצה
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:3000' 
                : 'https://countries-counter-project.onrender.com';

console.log("Version 2.0 - Current API URL:", API_URL);

// אתחול הגרף
const ctx = document.getElementById('statsChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Visits per Country', data: [], backgroundColor: 'rgba(52, 152, 219, 0.7)' }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
});

// פונקציה לבדיקת תקינות קוד מדינה מול API חיצוני
async function isValidCountry(code) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        return res.ok;
    } catch {
        return false;
    }
}

// פונקציה לשליפת הנתונים מהשרת/פונקציית הענן
async function fetchStats() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        
        // עדכון התצוגה בעמוד
        statsEl.textContent = JSON.stringify(data, null, 2);
        chart.data.labels = Object.keys(data);
        chart.data.datasets[0].data = Object.values(data);
        chart.update();
    } catch (err) {
        console.error('Error fetching stats:', err);
    }
}

// האזנה ללחיצה על כפתור הוספת ביקור
addVisitBtn.addEventListener('click', async () => {
    const code = countryInput.value.trim().toLowerCase();
    
    if (code.length !== 2) {
        return alert('Country code must be 2 letters');
    }

    const valid = await isValidCountry(code);
    if (!valid) {
        return alert('Invalid country code');
    }

    try {
        await fetch(`${API_URL}/stats/${code}`, { method: 'POST' });
        countryInput.value = '';
        fetchStats();
    } catch (err) {
        console.error('Error adding visit:', err);
    }
});

// הפעלה ראשונית וקביעת רענון אוטומטי
fetchStats();
setInterval(fetchStats, 5000);