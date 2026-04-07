const axios = require('axios');

const url = 'https://script.google.com/macros/s/AKfycbzm10bMltGN_RPQ__nM-WcIWxXcZoVoBjJSYCcfpY3KNmeyRaVF9COEMtuDbbJAs_6n/exec';

async function run() {
    try {
        console.log("Sending test webhook...");
        const res = await axios.post(url, {
            to: 'baobao2256@gmail.com',
            subject: 'Test Webhook',
            html: '<h1>Hello</h1><p>It works!</p>'
        });
        console.log("Response:", res.data);
    } catch (e) {
        if (e.response && e.response.status === 302) {
             console.log("Redirected", e.response.headers.location);
             // Axios follows redirects by default!
        }
        console.error("Error:", e.message);
    }
}
run();
