const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên sản phẩm là bắt buộc'],
            trim: true,
        },
        series: {
            type: String,
            required: [true, 'Dòng sản phẩm / Thương hiệu là bắt buộc'],
            trim: true,
        },
        manufacturer: {
            type: String,
            default: '',
            trim: true,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            default: null,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        price: {
            type: Number,
            required: [true, 'Giá sản phẩm là bắt buộc'],
            min: 0,
        },
        originalPrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        promotionPrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        sold: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'out-of-stock', 'pre-order'],
            default: 'active',
        },
        image: {
            type: String,
            default: '',
        },
        images: {
            type: [String],
            default: [],
        },
        sku: {
            type: String,
            default: '',
            trim: true,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        description: {
            type: String,
            default: '',
        },
        preorderDeadline: {
            type: String,
            default: '',
        },
        estimatedDelivery: {
            type: String,
            default: '',
        },
        maxPerOrder: {
            type: Number,
            default: 0,
            min: 0,
        },
        // Product flags
        isHot: {
            type: Boolean,
            default: false,
        },
        isPromotion: {
            type: Boolean,
            default: false,
        },
        isPreorder: {
            type: Boolean,
            default: false,
        },
        // Extended specs
        scale: {
            type: String,
            default: '',
            trim: true,
        },
        dimensions: {
            type: String,
            default: '',
            trim: true,
        },
        material: {
            type: String,
            default: '',
            trim: true,
        },
        specs: {
            material: { type: String, default: '' },
            size: { type: String, default: '' },
            sculptor: { type: String, default: '' },
            releaseDate: { type: String, default: '' },
        },
        tags: [String],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

const populateFields = [
    { path: 'category' },
    { path: 'brand' },
];

// DAO methods
const ProductDAO = {
    // Lấy tất cả sản phẩm (phân trang)
    selectAll: async (page = 1, limit = 20, filter = {}) => {
        const products = await Product.find(filter)
            .populate(populateFields)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Product.countDocuments(filter);
        return { products, total, page: Number(page), totalPages: Math.ceil(total / limit) };
    },

    // Lấy sản phẩm theo ID
    selectById: async (id) => {
        return await Product.findById(id).populate(populateFields);
    },

    // Lấy sản phẩm mới nhất
    selectNewProducts: async (limit = 8) => {
        return await Product.find({ status: { $in: ['active', 'pre-order'] } })
            .populate(populateFields)
            .sort({ createdAt: -1 })
            .limit(limit);
    },

    // Lấy tất cả sản phẩm active (cho trang "Tất cả sản phẩm")
    selectAllActive: async () => {
        return await Product.find({ status: { $in: ['active', 'pre-order'] } })
            .populate(populateFields)
            .sort({ createdAt: -1 });
    },

    // Lấy sản phẩm hot (isHot flag, fallback to best-selling)
    selectHotProducts: async (limit = 8) => {
        // First try products marked as hot
        let products = await Product.find({ status: { $in: ['active', 'pre-order'] }, isHot: true })
            .populate(populateFields)
            .sort({ sold: -1 })
            .limit(limit);
        // Fallback: if not enough hot products, fill with best sellers
        if (products.length < limit) {
            const hotIds = products.map(p => p._id);
            const fillProducts = await Product.find({
                status: { $in: ['active', 'pre-order'] },
                _id: { $nin: hotIds },
            })
                .populate(populateFields)
                .sort({ sold: -1 })
                .limit(limit - products.length);
            products = [...products, ...fillProducts];
        }
        return products;
    },

    // Lấy sản phẩm pre-order
    selectPreorderProducts: async (limit = 8) => {
        return await Product.find({
            $or: [{ isPreorder: true }, { status: 'pre-order' }],
        })
            .populate(populateFields)
            .sort({ createdAt: -1 })
            .limit(limit);
    },

    // Lấy sản phẩm khuyến mãi
    selectPromotionProducts: async (limit = 8) => {
        return await Product.find({
            isPromotion: true,
            status: { $in: ['active', 'pre-order'] },
        })
            .populate(populateFields)
            .sort({ createdAt: -1 })
            .limit(limit);
    },

    // Lấy sản phẩm theo danh mục
    selectByCategory: async (categoryId, page = 1, limit = 20) => {
        const filter = { category: categoryId, status: { $in: ['active', 'pre-order'] } };
        const products = await Product.find(filter)
            .populate(populateFields)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Product.countDocuments(filter);
        return { products, total, page: Number(page), totalPages: Math.ceil(total / limit) };
    },

    // Tìm kiếm sản phẩm
    selectByKeyword: async (keyword, page = 1, limit = 20) => {
        const filter = {
            status: { $in: ['active', 'pre-order'] },
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { series: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ],
        };
        const products = await Product.find(filter)
            .populate(populateFields)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Product.countDocuments(filter);
        return { products, total, page: Number(page), totalPages: Math.ceil(total / limit) };
    },

    // Thêm sản phẩm
    insert: async (data) => {
        const product = new Product(data);
        return await product.save();
    },

    // Cập nhật sản phẩm
    update: async (id, data) => {
        return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(populateFields);
    },

    // Xóa sản phẩm
    delete: async (id) => {
        return await Product.findByIdAndDelete(id);
    },
};

module.exports = ProductDAO;
