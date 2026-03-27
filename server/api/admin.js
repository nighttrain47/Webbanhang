const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const ProductDAO = require('../models/ProductDAO');
const CategoryDAO = require('../models/CategoryDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
const ReviewDAO = require('../models/ReviewDAO');
const ArticleDAO = require('../models/ArticleDAO');
const BrandDAO = require('../models/BrandDAO');
const { createToken, verifyToken } = require('../utils/jwtAuth');

// ==================== AUTH ====================

// Admin account (hardcoded for simplicity)
const ADMIN = { username: 'admin', password: '$2a$10$4mjtNgZqDd5oI4thZDsf0OU0LZZFv1laGeAv46kftX0BbsbmexoRi' }; // admin123

// POST /api/admin/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username !== ADMIN.username) {
            return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }
        const isMatch = await bcrypt.compare(password, ADMIN.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }
        const token = createToken({ username, role: 'admin' });
        res.json({ success: true, token, username });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== PRODUCTS (cần token) ====================

// GET /api/admin/products?page=1
router.get('/products', verifyToken, async (req, res) => {
    try {
        const { category, status, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (category && category !== 'all') filter.category = category;
        if (status && status !== 'all') filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { series: { $regex: search, $options: 'i' } },
            ];
        }
        const result = await ProductDAO.selectAll(page, limit, filter);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/products
router.post('/products', verifyToken, async (req, res) => {
    try {
        const product = await ProductDAO.insert(req.body);
        res.status(201).json(product);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'SKU đã tồn tại' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT /api/admin/products/:id
router.put('/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await ProductDAO.update(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await ProductDAO.delete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/products/bulk-delete
router.post('/products/bulk-delete', verifyToken, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Danh sách ID không hợp lệ' });
        }
        const result = await require('mongoose').model('Product').deleteMany({ _id: { $in: ids } });
        res.json({ success: true, message: `Đã xóa ${result.deletedCount} sản phẩm`, deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== CATEGORIES ====================

// GET /api/admin/categories
router.get('/categories', verifyToken, async (req, res) => {
    try {
        const categories = await CategoryDAO.selectAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/categories
router.post('/categories', verifyToken, async (req, res) => {
    try {
        const category = await CategoryDAO.insert(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT /api/admin/categories/:id
router.put('/categories/:id', verifyToken, async (req, res) => {
    try {
        const category = await CategoryDAO.update(req.params.id, req.body);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
        }
        res.json(category);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', verifyToken, async (req, res) => {
    try {
        const category = await CategoryDAO.delete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
        }
        res.json({ success: true, message: 'Đã xóa danh mục thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== CUSTOMERS ====================

// GET /api/admin/customers
router.get('/customers', verifyToken, async (req, res) => {
    try {
        const customers = await CustomerDAO.selectAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ORDERS ====================

// GET /api/admin/orders
router.get('/orders', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await OrderDAO.selectAll(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', verifyToken, async (req, res) => {
    try {
        const order = await OrderDAO.updateStatus(req.params.id, req.body.status);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== REVIEWS ====================

// GET /api/admin/reviews
router.get('/reviews', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await ReviewDAO.selectAll(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', verifyToken, async (req, res) => {
    try {
        const review = await ReviewDAO.delete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
        }
        res.json({ success: true, message: 'Đã xóa đánh giá' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ARTICLES ====================

// GET /api/admin/articles
router.get('/articles', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await ArticleDAO.selectAllAdmin(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/articles
router.post('/articles', verifyToken, async (req, res) => {
    try {
        const article = await ArticleDAO.insert(req.body);
        res.status(201).json(article);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Slug hoặc tiêu đề đã tồn tại' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT /api/admin/articles/:id
router.put('/articles/:id', verifyToken, async (req, res) => {
    try {
        const article = await ArticleDAO.update(req.params.id, req.body);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        }
        res.json(article);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE /api/admin/articles/:id
router.delete('/articles/:id', verifyToken, async (req, res) => {
    try {
        const article = await ArticleDAO.delete(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        }
        res.json({ success: true, message: 'Đã xóa bài viết thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ==================== BRANDS ====================

// GET /api/admin/brands
router.get('/brands', verifyToken, async (req, res) => {
    try {
        const brands = await BrandDAO.selectAll();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/brands
router.post('/brands', verifyToken, async (req, res) => {
    try {
        const brand = await BrandDAO.insert(req.body);
        res.status(201).json(brand);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Thương hiệu đã tồn tại' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT /api/admin/brands/:id
router.put('/brands/:id', verifyToken, async (req, res) => {
    try {
        const brand = await BrandDAO.update(req.params.id, req.body);
        if (!brand) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thương hiệu' });
        }
        res.json(brand);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE /api/admin/brands/:id
router.delete('/brands/:id', verifyToken, async (req, res) => {
    try {
        const brand = await BrandDAO.delete(req.params.id);
        if (!brand) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thương hiệu' });
        }
        res.json({ success: true, message: 'Đã xóa thương hiệu thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
