const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hobbyshop';
        const connectOptions = {};
        const isAtlasOrTls = uri.startsWith('mongodb+srv://') || uri.includes('tls=true');
        if (isAtlasOrTls) {
            connectOptions.tls = true;
        }
        if (process.env.MONGODB_TLS_INSECURE === 'true') {
            connectOptions.tlsInsecure = true;
        }

        const conn = await mongoose.connect(uri, connectOptions);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
