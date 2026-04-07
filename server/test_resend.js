const http = require('http');

const data = JSON.stringify({
  email: 'baobao2256@gmail.com',
  purpose: 'verify'
});

const req = http.request(
  'http://localhost:5000/api/customer/resend-otp',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  },
  (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log('Response:', res.statusCode, body));
  }
);

req.on('error', e => console.error('Error:', e));
req.write(data);
req.end();
