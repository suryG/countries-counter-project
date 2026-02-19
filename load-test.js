const URL = 'http://localhost:3000/stats/us'; 
const TOTAL_REQUESTS = 1000;  
const CONCURRENCY = 50;      

let completed = 0;
let failed = 0;

async function sendRequest() {
    try {
        const res = await fetch(URL, { method: 'POST' });
        if (!res.ok) failed++;
    } catch {
        failed++;
    } finally {
        completed++;
        if (completed % 50 === 0) console.log(`Completed: ${completed}/${TOTAL_REQUESTS}`);
    }
}

async function runLoadTest() {
    const start = Date.now();
    const batches = Math.ceil(TOTAL_REQUESTS / CONCURRENCY);

    for (let i = 0; i < batches; i++) {
        const promises = [];
        for (let j = 0; j < CONCURRENCY && i * CONCURRENCY + j < TOTAL_REQUESTS; j++) {
            promises.push(sendRequest());
        }
        await Promise.all(promises);
    }

    const end = Date.now();
    console.log(`Finished ${TOTAL_REQUESTS} requests in ${(end - start)/1000}s`);
    console.log(`Failed requests: ${failed}`);
}

runLoadTest();
