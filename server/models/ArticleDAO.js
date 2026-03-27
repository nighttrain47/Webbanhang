const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Tiêu đề bài viết là bắt buộc'],
            trim: true
        },
        slug: {
            type: String,
            unique: true,
            required: true
        },
        author: {
            type: String,
            default: 'HobbyShop Team'
        },
        content: {
            type: String, // Có thể chứa HTML từ Rich Text Editor
            required: [true, 'Nội dung bài viết là bắt buộc']
        },
        image: {
            type: String,
            default: ''
        },
        published: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Article = mongoose.model('Article', articleSchema);

const ArticleDAO = {
    selectAllAdmin: async (page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        const total = await Article.countDocuments();
        const articles = await Article.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return {
            articles,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };
    },

    selectAllPublished: async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        const total = await Article.countDocuments({ published: true });
        const articles = await Article.find({ published: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return {
            articles,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };
    },

    selectById: async (id) => {
        return await Article.findById(id);
    },

    selectBySlug: async (slug) => {
        return await Article.findOne({ slug, published: true });
    },

    insert: async (data) => {
        const article = new Article(data);
        return await article.save();
    },

    update: async (id, data) => {
        return await Article.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    },

    delete: async (id) => {
        return await Article.findByIdAndDelete(id);
    }
};

module.exports = ArticleDAO;
