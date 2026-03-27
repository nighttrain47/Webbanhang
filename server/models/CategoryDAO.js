const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên danh mục là bắt buộc'],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate slug from name
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

const CategoryDAO = {
    selectAll: async () => {
        return await Category.find().sort({ name: 1 });
    },

    selectById: async (id) => {
        return await Category.findById(id);
    },

    insert: async (data) => {
        const category = new Category(data);
        return await category.save();
    },

    update: async (id, data) => {
        return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    },

    delete: async (id) => {
        return await Category.findByIdAndDelete(id);
    },
};

module.exports = CategoryDAO;
