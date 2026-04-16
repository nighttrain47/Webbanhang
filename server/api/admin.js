const express = require('express');
const router = express.Router();
const ProductDAO = require('../models/ProductDAO');
const CategoryDAO = require('../models/CategoryDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
const EmailUtil = require('../utils/EmailUtil');
const ReviewDAO = require('../models/ReviewDAO');
const ArticleDAO = require('../models/ArticleDAO');
const BrandDAO = require('../models/BrandDAO');
const AdminDAO = require('../models/AdminDAO');
const { createToken, verifyToken } = require('../utils/jwtAuth');

// ==================== AUTH ====================

// POST /api/admin/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Thiếu username hoặc password' });
        }

        const totalAdmins = await AdminDAO.countActiveAdmins();
        if (totalAdmins === 0) {
            return res.status(503).json({
                success: false,
                message: 'Chưa có tài khoản admin. Hãy tạo bằng lệnh: npm run create:admin -- --username=<user> --password=<pass>',
            });
        }

        const admin = await AdminDAO.selectByUsername(username);
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }

        const token = createToken({ adminId: admin._id, username: admin.username, role: admin.role || 'admin' });
        res.json({ success: true, token, username: admin.username, role: admin.role || 'admin' });
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
        const CustomerModel = require('mongoose').model('Customer');
        const customers = await CustomerModel.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'customer',
                    as: 'orders'
                }
            },
            {
               $addFields: {
                   validOrders: {
                       $filter: {
                           input: '$orders',
                           as: 'order',
                           cond: { $ne: ['$$order.status', 'cancelled'] }
                       }
                   }
               }
            },
            {
                $project: {
                    password: 0,
                    orders: 0
                }
            },
            {
                $addFields: {
                    totalOrders: { $size: '$validOrders' },
                    totalSpent: { $sum: '$validOrders.total' }
                }
            },
            {
                $project: {
                    validOrders: 0
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        const result = customers.map(c => {
            const points = c.points || 0;
            let tier = 'Cấp 3';
            if (points >= 100000) tier = 'Đặc Cấp';
            else if (points >= 30000) tier = 'Cấp 1';
            else if (points >= 10000) tier = 'Cấp 2';

            return { ...c, tier };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/admin/customers/:id
router.delete('/customers/:id', verifyToken, async (req, res) => {
    try {
        const deletedCustomer = await CustomerDAO.delete(req.params.id);
        if (deletedCustomer) {
            res.json({ success: true, message: 'Đã xoá khách hàng' });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
        }
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
        const Order = require('mongoose').model('Order');
        const oldOrder = await Order.findById(req.params.id);
        if (!oldOrder) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        
        const wasDelivered = oldOrder.status === 'delivered';
        const isNowDelivered = req.body.status === 'delivered';

        const order = await OrderDAO.updateStatus(req.params.id, req.body.status);
        
        // Populate customer to get email and points
        await order.populate('customer');

        // Add points if transitioning to delivered
        if (!wasDelivered && isNowDelivered && order.customer) {
            const currentPoints = order.customer.points || 0;
            let rate = 0.01;
            if (currentPoints >= 100000) rate = 0.03;
            else if (currentPoints >= 30000) rate = 0.02;
            else if (currentPoints >= 10000) rate = 0.015;

            const pointsEarned = Math.floor(order.total * rate);
            order.customer.points = currentPoints + pointsEarned;
            await order.customer.save();
        } else if (wasDelivered && !isNowDelivered && order.customer) {
            // Revert points if rolling back from delivered
            // We use standard 1% for rollback to avoid over-deducting if tier changed, or we can use current tier rate.
            // Using current tier rate for rollback is an approximation.
            const currentPoints = order.customer.points || 0;
            let rate = 0.01;
            if (currentPoints >= 100000) rate = 0.03;
            else if (currentPoints >= 30000) rate = 0.02;
            else if (currentPoints >= 10000) rate = 0.015;

            const pointsReverted = Math.floor(order.total * rate);
            order.customer.points = Math.max(0, currentPoints - pointsReverted);
            await order.customer.save();
        }

        if (order.customer && order.customer.email) {
            await EmailUtil.sendOrderStatusEmail(order.customer.email, req.body.status, order._id);
        }

        res.json({ success: true, order });
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

// ==================== DASHBOARDS & REPORTS ====================

const mongoose = require('mongoose');

// GET /api/admin/dashboard
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const Order = mongoose.model('Order');
        const Customer = mongoose.model('Customer');
        const Product = mongoose.model('Product');

        // Current Month boundary
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Stats
        const revenueAgg = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
        ]);
        const monthlyRevenue = revenueAgg[0]?.total || 0;
        const monthlyOrders = revenueAgg[0]?.count || 0;

        const newUsers = await Customer.countDocuments({ createdAt: { $gte: startOfMonth } });
        const totalProducts = await Product.countDocuments();
        
        const activeProducts = await Product.countDocuments({ 
            $or: [{ status: 'active' }, { status: { $exists: false } }, { status: null }],
            stock: { $gt: 0 },
            isPreorder: { $ne: true }
        });
        const preorderProducts = await Product.countDocuments({ 
            $or: [{ status: 'pre-order' }, { isPreorder: true }] 
        });
        const outOfStockProducts = await Product.countDocuments({ 
            $or: [{ status: 'out-of-stock' }, { stock: { $lte: 0 } }] 
        });
        const totalStockAgg = await Product.aggregate([
            { $group: { _id: null, totalStock: { $sum: '$stock' } } }
        ]);
        const totalStock = totalStockAgg[0]?.totalStock || 0;

        // Recent Orders
        const recentOrdersRaw = await Order.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name');
        const recentOrders = recentOrdersRaw.map(o => ({
            id: o._id,
            customer: o.customer?.name || 'Khách vãng lai',
            amount: o.total
        }));

        // Top Products
        const topProductsAgg = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product', name: { $first: '$items.name' }, sales: { $sum: '$items.quantity' } } },
            { $sort: { sales: -1 } },
            { $limit: 5 }
        ]);
        const topProducts = topProductsAgg.map(p => ({ name: p.name, sales: p.sales }));

        // 7 Days Revenue
        const startOf7Days = new Date();
        startOf7Days.setDate(startOf7Days.getDate() - 6);
        startOf7Days.setHours(0, 0, 0, 0);
        
        const dailyRevenueRaw = await Order.aggregate([
            { $match: { createdAt: { $gte: startOf7Days }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" } },
                    total: { $sum: '$total' }
                }
            }
        ]);
        
        const revenueMap = {};
        dailyRevenueRaw.forEach(r => revenueMap[r._id] = r.total);
        
        const revenue7days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
            revenue7days.push(revenueMap[dateStr] || 0);
        }

        res.json({
            stats: { 
                monthlyRevenue, 
                monthlyOrders, 
                newUsers, 
                totalProducts,
                activeProducts,
                preorderProducts,
                outOfStockProducts,
                totalStock
            },
            recentOrders,
            topProducts,
            revenue7days
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/admin/reports
router.get('/reports', verifyToken, async (req, res) => {
    try {
        const Order = mongoose.model('Order');
        const Customer = mongoose.model('Customer');
        const Product = mongoose.model('Product');

        // Total 7 days Stats
        const startOf7Days = new Date();
        startOf7Days.setDate(startOf7Days.getDate() - 6);
        startOf7Days.setHours(0, 0, 0, 0);

        const currentWeekAgg = await Order.aggregate([
            { $match: { createdAt: { $gte: startOf7Days }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 }, itemsSold: { $sum: { $sum: '$items.quantity' } } } }
        ]);
        const currentData = currentWeekAgg[0] || { total: 0, count: 0, itemsSold: 0 };
        const averageOrderValue = currentData.count > 0 ? (currentData.total / currentData.count) : 0;

        // Daily Revenue for Chart
        const dailyRevenueRaw = await Order.aggregate([
            { $match: { createdAt: { $gte: startOf7Days }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" } },
                    total: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        const revenueData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
            const dayRecord = dailyRevenueRaw.find(r => r._id === dateStr);
            revenueData.push({
                date: d.toLocaleDateString('vi-VN'),
                revenue: dayRecord?.total || 0,
                orders: dayRecord?.count || 0
            });
        }

        // Top Products Full Table
        const topProductsFull = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.name' },
                    sales: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
            {
               $lookup: {
                   from: 'products',
                   localField: '_id',
                   foreignField: '_id',
                   as: 'productInfo'
               }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
            {
               $lookup: {
                   from: 'categories',
                   localField: 'productInfo.category',
                   foreignField: '_id',
                   as: 'categoryInfo'
               }
            },
            { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: 1,
                    category: { $ifNull: ['$categoryInfo.name', 'Chưa có phân loại'] },
                    sales: 1,
                    revenue: 1,
                    growth: { $literal: Math.floor(Math.random() * 20) + 1 } // fake growth for now
                }
            }
        ]);

        // Category Breakdown
        const categoryBreakdownAgg = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
             {
                $lookup: {
                   from: 'categories',
                   localField: 'productInfo.category',
                   foreignField: '_id',
                   as: 'categoryInfo'
               }
            },
            { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$categoryInfo.name',
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    orders: { $sum: 1 } // technically order items sold
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        let totalRevAllocated = 0;
        const categoryBreakdownList = categoryBreakdownAgg.map(cat => {
            totalRevAllocated += cat.revenue;
            return {
                category: cat._id || 'Khác',
                revenue: cat.revenue,
                orders: cat.orders
            }
        });

        const categoryBreakdown = categoryBreakdownList.map(cat => ({
            ...cat,
            percentage: totalRevAllocated > 0 ? Math.round((cat.revenue / totalRevAllocated) * 100) : 0
        }));

        // Additional Metrics
        const totalDelivered = await Order.countDocuments({ createdAt: { $gte: startOf7Days }, status: 'delivered' });
        const completionRate = currentData.count > 0 ? Math.round((totalDelivered / currentData.count) * 100) : 0;

        const returningCustomersCount = await Order.aggregate([
            { $group: { _id: '$customer', orderCount: { $sum: 1 } } },
            { $match: { orderCount: { $gt: 1 } } },
            { $count: "count" }
        ]);
        const returningCount = returningCustomersCount[0]?.count || 0;
        const totalCustomersCount = await Customer.countDocuments();
        const returnRate = totalCustomersCount > 0 ? Math.round((returningCount / totalCustomersCount) * 100) : 0;

        res.json({
            stats: {
                totalRevenue: currentData.total,
                totalOrders: currentData.count,
                averageOrderValue,
                itemsSold: currentData.itemsSold,
                totalDelivered,
                completionRate,
                returnRate
            },
            revenueData,
            categoryBreakdown,
            topProducts: topProductsFull
        });

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
