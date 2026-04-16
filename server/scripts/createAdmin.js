require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../utils/db');
const AdminDAO = require('../models/AdminDAO');

function getArg(flagName) {
    const prefix = `--${flagName}=`;
    const arg = process.argv.find((item) => item.startsWith(prefix));
    return arg ? arg.slice(prefix.length).trim() : '';
}

async function main() {
    const username = getArg('username') || process.env.ADMIN_USERNAME || '';
    const password = getArg('password') || process.env.ADMIN_PASSWORD || '';
    const name = getArg('name') || username;
    const role = getArg('role') || 'admin';

    if (!username || !password) {
        console.error('Usage: npm run create:admin -- --username=<username> --password=<password> [--name=<displayName>] [--role=admin|superadmin]');
        process.exit(1);
    }

    if (!['admin', 'superadmin'].includes(role)) {
        console.error('Role không hợp lệ. Chỉ chấp nhận: admin, superadmin');
        process.exit(1);
    }

    await connectDB();

    const existingAdmin = await AdminDAO.selectByUsernameAny(username);
    if (existingAdmin) {
        console.error(`Admin username '${username}' đã tồn tại.`);
        await mongoose.disconnect();
        process.exit(1);
    }

    const createdAdmin = await AdminDAO.insert({ username, password, name, role, active: true });

    console.log('Tạo admin thành công:');
    console.log(`- id: ${createdAdmin._id}`);
    console.log(`- username: ${createdAdmin.username}`);
    console.log(`- role: ${createdAdmin.role}`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(async (error) => {
    console.error('Tạo admin thất bại:', error.message);
    try {
        await mongoose.disconnect();
    } catch (_error) {
        // Ignore disconnect errors on failure path.
    }
    process.exit(1);
});