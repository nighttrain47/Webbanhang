const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSubSchema = new mongoose.Schema(
    {
        label: { type: String, default: 'Nhà riêng' },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, default: '' },
        isDefault: { type: Boolean, default: false },
    },
    { _id: true }
);

const paymentMethodSubSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        provider: { type: String, required: true },
        cardNumber: { type: String, required: true },
        expiryDate: { type: String, default: '' },
        nameOnCard: { type: String, default: '' },
        isDefault: { type: Boolean, default: false },
    },
    { _id: true }
);

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
        addresses: {
            type: [addressSubSchema],
            default: [],
        },
        paymentMethods: {
            type: [paymentMethodSubSchema],
            default: [],
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
        points: {
            type: Number,
            default: 0,
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

    // ===== Address Methods =====

    getAddresses: async (customerId) => {
        const customer = await Customer.findById(customerId).select('addresses');
        return customer ? customer.addresses : [];
    },

    addAddress: async (customerId, addressData) => {
        const customer = await Customer.findById(customerId);
        if (!customer) return null;
        // If this is the first address or marked as default, unset others
        if (customer.addresses.length === 0 || addressData.isDefault) {
            customer.addresses.forEach(a => (a.isDefault = false));
            addressData.isDefault = true;
        }
        customer.addresses.push(addressData);
        await customer.save();
        return customer.addresses;
    },

    updateAddress: async (customerId, addressId, addressData) => {
        const customer = await Customer.findById(customerId);
        if (!customer) return null;
        const addr = customer.addresses.id(addressId);
        if (!addr) return null;
        if (addressData.isDefault) {
            customer.addresses.forEach(a => (a.isDefault = false));
        }
        Object.assign(addr, addressData);
        await customer.save();
        return customer.addresses;
    },

    deleteAddress: async (customerId, addressId) => {
        const customer = await Customer.findById(customerId);
        if (!customer) return null;
        const addr = customer.addresses.id(addressId);
        if (!addr) return null;
        const wasDefault = addr.isDefault;
        customer.addresses.pull(addressId);
        // If deleted address was default, set first remaining as default
        if (wasDefault && customer.addresses.length > 0) {
            customer.addresses[0].isDefault = true;
        }
        await customer.save();
        return customer.addresses;
    },

    setDefaultAddress: async (customerId, addressId) => {
        const customer = await Customer.findById(customerId);
        if (!customer) return null;
        customer.addresses.forEach(a => {
            a.isDefault = a._id.toString() === addressId;
        });
        await customer.save();
        return customer.addresses;
    },

    // ===== Payment Method Methods =====

    getPaymentMethods: async (customerId) => {
        const customer = await Customer.findById(customerId).select('paymentMethods');
        return customer ? customer.paymentMethods : [];
    },

    addPaymentMethod: async (customerId, paymentData) => {
        const customer = await Customer.findById(customerId);
        if (!customer) return null;
        if (customer.paymentMethods.length === 0 || paymentData.isDefault) {
            customer.paymentMethods.forEach(p => (p.isDefault = false));
            paymentData.isDefault = true;
        }
        customer.paymentMethods.push(paymentData);
        await customer.save();
        return customer.paymentMethods;
    },

    deletePaymentMethod: async (customerId, paymentId) => {
        const customer = await Customer.findById(customerId);
        if (!customer) return null;
        const method = customer.paymentMethods.id(paymentId);
        if (!method) return null;
        const wasDefault = method.isDefault;
        customer.paymentMethods.pull(paymentId);
        if (wasDefault && customer.paymentMethods.length > 0) {
            customer.paymentMethods[0].isDefault = true;
        }
        await customer.save();
        return customer.paymentMethods;
    },

    setDefaultPaymentMethod: async (customerId, paymentId) => {
        const customer = await Customer.findById(customerId);
        if (!customer) return null;
        customer.paymentMethods.forEach(p => {
            p.isDefault = p._id.toString() === paymentId;
        });
        await customer.save();
        return customer.paymentMethods;
    },
};

module.exports = CustomerDAO;
