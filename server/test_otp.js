const mongoose = require('mongoose');
const DraftCustomerDAO = require('./models/DraftCustomerDAO');
require('dotenv').config({ path: './.env' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        const d = await DraftCustomerDAO.selectByEmail("baobao2256@gmail.com");
        if (d) console.log("LATEST OTP IS:", d.otp);
        else console.log("No draft found");
    } catch(e) {}
    process.exit(0);
}
run();
