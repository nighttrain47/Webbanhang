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

    delete: async (id) => {
        return await Customer.findByIdAndDelete(id);
    },
};

module.exports = CustomerDAO;
