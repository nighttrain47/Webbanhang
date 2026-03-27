const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Mã sản phẩm là bắt buộc'],
            ref: 'Product'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Customer'
        },
        userName: {
            type: String,
            required: [true, 'Tên người đánh giá là bắt buộc'],
            trim: true
        },
        rating: {
            type: Number,
            required: [true, 'Điểm số là bắt buộc'],
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: [true, 'Nội dung đánh giá là bắt buộc'],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Review = mongoose.model('Review', reviewSchema);

const ReviewDAO = {
    // Admin lấy tất cả
    selectAll: async (page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        const total = await Review.countDocuments();
        const reviews = await Review.find()
            .populate('productId', 'name image')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return {
            reviews,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };
    },

    // Lấy list đánh giá của 1 sản phẩm
    selectByProductId: async (productId) => {
        return await Review.find({ productId }).sort({ createdAt: -1 });
    },

    // Kiểm tra đã đánh giá chưa (nếu cần)
    selectByUserAndProduct: async (userId, productId) => {
        if (!userId) return null;
        return await Review.findOne({ userId, productId });
    },

    insert: async (data) => {
        const review = new Review(data);
        return await review.save();
    },

    delete: async (id) => {
        return await Review.findByIdAndDelete(id);
    }
};

module.exports = ReviewDAO;
