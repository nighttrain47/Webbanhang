const mongoose = require('mongoose');
const CustomerDAO = require('./models/CustomerDAO');
require('dotenv').config({ path: './.env' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    try {
        const c = await CustomerDAO.selectByEmail("baobao2256@gmail.com");
        if (c) {
             await CustomerDAO.delete(c._id);
             console.log("Deleted accidental registration for", c.email);
        } else {
             console.log("Not found.");
        }
    } catch(e) {
        console.error("Catched Error:", e);
    }
    process.exit(0);
}
run();
