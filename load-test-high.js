const URL = 'http://localhost:3000/stats/us'; 
const TOTAL_REQUESTS = 1000;  
const CONCURRENCY = 200;      
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
    }
}

async function runBatch(batchSize) {
    const promises = [];
    for (let i = 0; i < batchSize; i++) promises.push(sendRequest());
    await Promise.all(promises);
}

async function runLoadTest() {
    console.log(`Starting load test: ${TOTAL_REQUESTS} requests, concurrency ${CONCURRENCY}`);
    const start = Date.now();

    const batches = Math.ceil(TOTAL_REQUESTS / CONCURRENCY);

    for (let i = 0; i < batches; i++) {
        await runBatch(CONCURRENCY);
        console.log(`Completed: ${completed}/${TOTAL_REQUESTS}, Failed: ${failed}`);
    }

    const end = Date.now();
    console.log(`\nFinished ${TOTAL_REQUESTS} requests in ${(end - start)/1000}s`);
    console.log(`Total failed requests: ${failed}`);
}

runLoadTest();
