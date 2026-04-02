const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema(
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
            required: [true, 'Tên là bắt buộc'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email là bắt buộc'],
            trim: true,
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            default: '',
        },
        active: {
            type: Boolean,
            default: false,
        },
        token: {
            type: String,
            default: '',
        },
        otp: {
            type: String,
            default: '',
        },
        otpExpiry: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
customerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
customerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Customer = mongoose.model('Customer', customerSchema);

const CustomerDAO = {
    selectAll: async () => {
        return await Customer.find().select('-password').sort({ createdAt: -1 });
    },

    selectById: async (id) => {
        return await Customer.findById(id).select('-password');
    },

    selectByUsername: async (username) => {
        return await Customer.findOne({ username });
    },

    selectByEmail: async (email) => {
        return await Customer.findOne({ email });
    },

    insert: async (data) => {
        const customer = new Customer(data);
        return await customer.save();
    },

    update: async (id, data) => {
        return await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
    },

    active: async (id, token) => {
        const customer = await Customer.findById(id);
        if (customer && customer.token === token) {
            customer.active = true;
            customer.token = '';
            return await customer.save();
        }
        return null;
    },

    // ===== OTP Methods =====

    updateOTP: async (email, otp, expiry) => {
        return await Customer.findOneAndUpdate(
            { email },
            { otp, otpExpiry: expiry },
            { new: true }
        );
    },

    verifyOTP: async (email, otp) => {
        const customer = await Customer.findOne({ email });
        if (!customer) return { valid: false, reason: 'Email không tồn tại' };
        if (!customer.otp || customer.otp !== otp) return { valid: false, reason: 'Mã OTP không đúng' };
        if (customer.otpExpiry && new Date() > customer.otpExpiry) return { valid: false, reason: 'Mã OTP đã hết hạn' };
        return { valid: true, customer };
    },

    activateAccount: async (email) => {
        return await Customer.findOneAndUpdate(
            { email },
            { active: true, otp: '', otpExpiry: null },
            { new: true }
        );
    },

    updatePassword: async (email, newPassword) => {
        const customer = await Customer.findOne({ email });
        if (!customer) return null;
        customer.password = newPassword; // Will be hashed by pre-save hook
        customer.otp = '';
        customer.otpExpiry = null;
        return await customer.save();
    },

    delete: async (id) => {
        return await Customer.findByIdAndDelete(id);
    },
};

module.exports = CustomerDAO;
