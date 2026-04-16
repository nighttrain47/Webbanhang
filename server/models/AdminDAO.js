const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username là bắt buộc'],
            trim: true,
            unique: true,
            minlength: 3,
        },
        password: {
            type: String,
            required: [true, 'Password là bắt buộc'],
            minlength: 6,
        },
        name: {
            type: String,
            default: '',
            trim: true,
        },
        role: {
            type: String,
            enum: ['admin', 'superadmin'],
            default: 'admin',
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

const AdminDAO = {
    selectByUsername: async (username) => {
        return await Admin.findOne({ username, active: true });
    },

    selectByUsernameAny: async (username) => {
        return await Admin.findOne({ username });
    },

    countActiveAdmins: async () => {
        return await Admin.countDocuments({ active: true });
    },

    insert: async (data) => {
        const admin = new Admin(data);
        return await admin.save();
    },
};

module.exports = AdminDAO;