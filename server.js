const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;
const app = express();
const VALID_URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

app.use(express.json());
app.use(cors({
    origin: '*',
}));

app.get('/', (_, res) => {
    res.status(200).send('Service is up!');
});

app.all('*', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        res.send();
        return;
    }

    const targetURL = req.url.replace('/', '');

    if (!VALID_URL_REGEX.test(targetURL)) {
        res.status(400).send('Invalid URL');
        return;
    }

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