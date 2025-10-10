const express = require('express');
const client = require('prom-client');
const app = express();
const PORT = 3000;
const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get('/', (req, res) => {
    // FLUENTD/LOKI JSON LOGGING: Structured log for easy scraping
    console.log(`{"level": "INFO", "ts": "${new Date().toISOString()}", "msg": "Request processed successfully."}`);
    res.send('Observability Test App Running! Metrics check /metrics.');
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

app.listen(PORT, () => { console.log('Server running on port ${PORT}'); });