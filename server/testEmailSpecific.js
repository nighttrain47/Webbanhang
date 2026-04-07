require('dotenv').config({ path: './.env' });
const { sendOTP } = require('./utils/EmailUtil');

async function testEmail() {
    console.log("Sending OTP to baobao2256...");
    try {
        const res = await sendOTP('baobao2256@gmail.com', '123456', 'verify');
        console.log("Result:", res);
    } catch (err) {
        console.error("Fatal Error:", err);
    }
}
testEmail();
