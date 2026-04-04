const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const draftCustomerSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username là bắt buộc'],
            trim: true,
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
            lowercase: true,
        },
        phone: {
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

// Removed pre-save hash hook to avoid double hashing when transferring to Customer

// TTL Index trên createdAt: Tự động xóa sau 15 phút (900 seconds)
draftCustomerSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const DraftCustomer = mongoose.model('DraftCustomer', draftCustomerSchema);

const DraftCustomerDAO = {
    selectByUsername: async (username) => {
        return await DraftCustomer.findOne({ username });
    },

    selectByEmail: async (email) => {
        return await DraftCustomer.findOne({ email });
    },

    insertOrUpdate: async (data) => {
        // Find existing draft by email
        const existing = await DraftCustomer.findOne({ email: data.email });
        if (existing) {
            existing.username = data.username;
            existing.password = data.password; // hook pre-save will hash
            existing.name = data.name;
            existing.phone = data.phone || '';
            existing.otp = data.otp;
            existing.otpExpiry = data.otpExpiry;
            // Need to touch updatedAt / createdAt?
            return await existing.save();
        } else {
            const draft = new DraftCustomer(data);
            return await draft.save();
        }
    },

    verifyOTP: async (email, otp) => {
        const draft = await DraftCustomer.findOne({ email });
        if (!draft) return { valid: false, reason: 'Email nháp không tồn tại hoặc đã hết hạn (15 phút)' };
        if (!draft.otp || draft.otp !== otp) return { valid: false, reason: 'Mã OTP không đúng' };
        if (draft.otpExpiry && new Date() > draft.otpExpiry) return { valid: false, reason: 'Mã OTP đã hết hạn' };
        return { valid: true, draft };
    },

    deleteByEmail: async (email) => {
        return await DraftCustomer.deleteMany({ email });
    },

    updateOTP: async (email, otp, expiry) => {
        return await DraftCustomer.findOneAndUpdate(
            { email },
            { otp, otpExpiry: expiry },
            { new: true }
        );
    }
};

module.exports = DraftCustomerDAO;
