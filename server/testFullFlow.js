const mongoose = require('mongoose');
const CustomerDAO = require('./models/CustomerDAO');
const DraftCustomerDAO = require('./models/DraftCustomerDAO');
const EmailUtil = require('./utils/EmailUtil');
require('dotenv').config({ path: './.env' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = 'test_asdf_qwer@gmail.com';
    await CustomerDAO.delete((await CustomerDAO.selectByEmail(email))?._id);
    await DraftCustomerDAO.deleteByEmail(email);

    const otp = EmailUtil.generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    console.log("created draft with otp", otp);
    await DraftCustomerDAO.insertOrUpdate({
        username: 'test_asdf', password: 'password123', name: 'Test User', email,
        phone: '', otp, otpExpiry
    });

    const result = await DraftCustomerDAO.verifyOTP(email, otp);
    console.log("verify result:", result.valid, result.reason);

    if (result.valid) {
        try {
            const draft = result.draft;
            const inserted = await CustomerDAO.insert({
                username: draft.username,
                password: draft.password,
                name: draft.name,
                email: draft.email,
                phone: draft.phone || '',
                active: true,
                token: '',
                otp: '',
                otpExpiry: null
            });
            console.log("Insert success!", inserted.email);
            
            await CustomerDAO.delete(inserted._id);
        } catch (err) {
            console.log("Insert failed:", err);
        }
    }
    
    process.exit(0);
}
run();
