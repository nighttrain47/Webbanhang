const http = require('http');

const data = JSON.stringify({
  username: 'ktb_test_123',
  email: 'kieubao2256+123@gmail.com',
  password: 'Password123!',
  confirmPassword: 'Password123!'
});

const req = http.request(
  'http://localhost:5000/api/customer/signup',
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
