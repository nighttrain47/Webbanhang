const mongoose = require('mongoose');
const CustomerDAO = require('./models/CustomerDAO');
const DraftCustomerDAO = require('./models/DraftCustomerDAO');
require('dotenv').config({ path: './.env' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    try {
        const draft = await DraftCustomerDAO.selectByEmail("baobao2256@gmail.com");
        console.log("Draft Customer:", draft);

        if (draft) {
             const result = await DraftCustomerDAO.verifyOTP("baobao2256@gmail.com", draft.otp);
             console.log("Verify Result:", result);

             if (result.valid) {
                 const draftData = result.draft;
                 const inserted = await CustomerDAO.insert({
                     username: draftData.username,
                     password: draftData.password,
                     name: draftData.name,
                     email: draftData.email,
                     phone: draftData.phone || '',
                     active: true,
                     token: '',
                     otp: '',
                     otpExpiry: null
                 });
                 console.log("Inserted:", inserted);
             }
        }

    } catch(e) {
        console.error("Catched Error:", e);
    }
    process.exit(0);
}
run();
