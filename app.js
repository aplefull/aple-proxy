const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.all('*', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        res.send();
        return;
    }

    const targetURL = req.url.replace('/', '');
    console.log(`Fetching ${targetURL}`);
    const response = await fetch(targetURL, {
        method: req.method,
        json: req.body,
        headers: {
            'Authorization': req.header('Authorization')
        }
    });

    res.send(await response.json());
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
