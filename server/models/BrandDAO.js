const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên thương hiệu là bắt buộc'],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            trim: true,
            unique: true,
        },
        logo: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate slug from name
brandSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    next();
});

const Brand = mongoose.model('Brand', brandSchema);

const BrandDAO = {
    selectAll: async () => {
        return await Brand.find().sort({ name: 1 });
    },

    selectById: async (id) => {
        return await Brand.findById(id);
    },

    insert: async (data) => {
        const brand = new Brand(data);
        return await brand.save();
    },

    update: async (id, data) => {
        return await Brand.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    },

    delete: async (id) => {
        return await Brand.findByIdAndDelete(id);
    },
};

module.exports = BrandDAO;
