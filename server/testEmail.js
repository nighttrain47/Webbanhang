require('dotenv').config({ path: './.env' });
const { sendOTP } = require('./utils/EmailUtil');

async function run() {
    console.log("Checking environment...");
    console.log("USER:", process.env.EMAIL_USER);
    try {
        const res = await sendOTP('test@example.com', '123456', 'verify');
        console.log("Result:", res);
    } catch (e) {
        console.log("Exception:", e);
    }
}
run();
