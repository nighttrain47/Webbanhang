const express = require('express');
const router = express.Router();
const ProductDAO = require('../models/ProductDAO');
const CategoryDAO = require('../models/CategoryDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
const ReviewDAO = require('../models/ReviewDAO');
const ArticleDAO = require('../models/ArticleDAO');
const BrandDAO = require('../models/BrandDAO');
const EmailUtil = require('../utils/EmailUtil');
const { createToken, verifyToken } = require('../utils/jwtAuth');
const { generateOTP, sendOTP } = require('../utils/EmailUtil');

// ==================== ARTICLES ====================

// GET /api/customer/articles
router.get('/articles', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await ArticleDAO.selectAllPublished(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/customer/articles/:slug
router.get('/articles/:slug', async (req, res) => {
    try {
        const article = await ArticleDAO.selectBySlug(req.params.slug);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== BRANDS ====================

// GET /api/customer/brands
router.get('/brands', async (req, res) => {
    try {
        const brands = await BrandDAO.selectAll();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== CATEGORIES ====================

// GET /api/customer/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await CategoryDAO.selectAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== PRODUCTS ====================

// GET /api/customer/products/new
router.get('/products/new', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const products = await ProductDAO.selectNewProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/customer/products/hot
router.get('/products/hot', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const products = await ProductDAO.selectHotProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/customer/products/preorder
router.get('/products/preorder', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const products = await ProductDAO.selectPreorderProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/customer/products/promotion
router.get('/products/promotion', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const products = await ProductDAO.selectPromotionProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/customer/products/category/:cid
router.get('/products/category/:cid', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await ProductDAO.selectByCategory(req.params.cid, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/customer/products/search/:keyword
router.get('/products/search/:keyword', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await ProductDAO.selectByKeyword(req.params.keyword, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/customer/products/:id
router.get('/products/:id', async (req, res) => {
    try {
        const product = await ProductDAO.selectById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== REVIEWS ====================

// GET /api/customer/products/:id/reviews
router.get('/products/:id/reviews', async (req, res) => {
    try {
        const reviews = await ReviewDAO.selectByProductId(req.params.id);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/customer/products/:id/reviews
router.post('/products/:id/reviews', async (req, res) => {
    try {
        const { userName, rating, comment, userId } = req.body;
        const productId = req.params.id;
        
        if (userId) {
            const existingReview = await ReviewDAO.selectByUserAndProduct(userId, productId);
            if (existingReview) {
                return res.status(400).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi' });
            }
        }

        const review = await ReviewDAO.insert({
            productId,
            userId,
            userName,
            rating,
            comment
        });

        res.status(201).json({ success: true, review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ==================== AUTH ====================

// POST /api/customer/signup — Register + send OTP (account inactive until verified)
router.post('/signup', async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
        }
        // Check duplicates
        const existingUser = await CustomerDAO.selectByUsername(username);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
        }
        const existingEmail = await CustomerDAO.selectByEmail(email);
        if (existingEmail && existingEmail.active) {
            return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        }

        // If email exists but not yet activated, delete old record so they can re-register
        if (existingEmail && !existingEmail.active) {
            await CustomerDAO.delete(existingEmail._id);
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Create customer with active: false
        const name = username;
        await CustomerDAO.insert({
            username, password, name, email,
            phone: phone || '', token: '',
            active: false, otp, otpExpiry,
        });

        // Send OTP email
        const emailResult = await sendOTP(email, otp, 'verify');
        if (!emailResult.success) {
            return res.status(500).json({ success: false, message: 'Không thể gửi email xác thực. Vui lòng thử lại.' });
        }

        res.status(201).json({
            success: true,
            message: 'Đã gửi mã xác thực tới email của bạn.',
            email,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// POST /api/customer/verify-otp — Verify OTP (and activate account if purpose is 'verify')
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, purpose } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mã OTP' });
        }

        const result = await CustomerDAO.verifyOTP(email, otp);
        if (!result.valid) {
            return res.status(400).json({ success: false, message: result.reason });
        }

        // Only activate account for signup verification
        if (purpose !== 'reset') {
            await CustomerDAO.activateAccount(email);
            return res.json({ success: true, message: 'Xác thực tài khoản thành công! Bạn có thể đăng nhập.' });
        }

        res.json({ success: true, message: 'Xác thực OTP thành công.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/customer/resend-otp — Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { email, purpose } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập email' });
        }

        const customer = await CustomerDAO.selectByEmail(email);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Email không tồn tại' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await CustomerDAO.updateOTP(email, otp, otpExpiry);

        const emailResult = await sendOTP(email, otp, purpose || 'verify');
        if (!emailResult.success) {
            return res.status(500).json({ success: false, message: 'Không thể gửi email. Vui lòng thử lại.' });
        }

        res.json({ success: true, message: 'Đã gửi lại mã xác thực.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/customer/forgot-password — Send OTP for password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập email' });
        }

        const customer = await CustomerDAO.selectByEmail(email);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Email không tồn tại trong hệ thống' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await CustomerDAO.updateOTP(email, otp, otpExpiry);

        const emailResult = await sendOTP(email, otp, 'reset');
        if (!emailResult.success) {
            return res.status(500).json({ success: false, message: 'Không thể gửi email. Vui lòng thử lại.' });
        }

        res.json({ success: true, message: 'Đã gửi mã xác thực tới email của bạn.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/customer/reset-password — Verify OTP + change password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        const result = await CustomerDAO.verifyOTP(email, otp);
        if (!result.valid) {
            return res.status(400).json({ success: false, message: result.reason });
        }

        await CustomerDAO.updatePassword(email, newPassword);
        res.json({ success: true, message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/customer/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
        }
        const customer = await CustomerDAO.selectByEmail(email);
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }
        if (!customer.active) {
            return res.status(401).json({ success: false, message: 'Tài khoản chưa được kích hoạt. Vui lòng xác thực OTP.', needVerify: true, email: customer.email });
        }
        const isMatch = await customer.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }
        const jwtToken = createToken({ id: customer._id, username: customer.username, role: 'customer' });
        res.json({
            success: true,
            token: jwtToken,
            customer: { id: customer._id, username: customer.username, name: customer.name, email: customer.email, phone: customer.phone, createdAt: customer.createdAt },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/customer/active?id=xxx&token=xxx
router.get('/active', async (req, res) => {
    try {
        const { id, token } = req.query;
        const result = await CustomerDAO.active(id, token);
        if (result) {
            res.json({ success: true, message: 'Kích hoạt tài khoản thành công' });
        } else {
            res.status(400).json({ success: false, message: 'Token không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ORDERS (cần token) ====================

// POST /api/customer/orders
router.post('/orders', verifyToken, async (req, res) => {
    try {
        const { items, shippingAddress, note } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
        }

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await OrderDAO.insert({
            customer: req.user.id,
            items: items.map(item => ({
                product: item.productId || item.product,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total,
            shippingAddress: shippingAddress || '',
            note: note || '',
            status: 'pending'
        });

        // Get customer email to send confirmation email
        const customer = await CustomerDAO.selectById(req.user.id);
        if (customer && customer.email) {
            await EmailUtil.sendOrderPlacedEmail(
                customer.email, 
                order._id, 
                items, 
                total, 
                shippingAddress || ''
            );
        }

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// GET /api/customer/orders
router.get('/orders', verifyToken, async (req, res) => {
    try {
        const orders = await OrderDAO.selectByCustomer(req.user.id);
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== PROFILE (cần token) ====================

// GET /api/customer/profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const customer = await CustomerDAO.selectById(req.user.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }
        res.json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/customer/profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;

        const customer = await CustomerDAO.update(req.user.id, updateData);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }
        res.json({ success: true, customer });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE /api/customer/profile — Xóa tài khoản
router.delete('/profile', verifyToken, async (req, res) => {
    try {
        // Delete all orders belonging to this customer
        await OrderDAO.deleteByCustomer(req.user.id);
        // Delete the customer account
        const result = await CustomerDAO.delete(req.user.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }
        res.json({ success: true, message: 'Tài khoản đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ADDRESSES (cần token) ====================

// GET /api/customer/addresses
router.get('/addresses', verifyToken, async (req, res) => {
    try {
        const addresses = await CustomerDAO.getAddresses(req.user.id);
        res.json({ success: true, addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/customer/addresses
router.post('/addresses', verifyToken, async (req, res) => {
    try {
        const { label, fullName, phone, address, city, postalCode, isDefault } = req.body;
        if (!fullName || !phone || !address || !city) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin địa chỉ hợp lệ' });
        }
        
        const addresses = await CustomerDAO.addAddress(req.user.id, {
            label, fullName, phone, address, city, postalCode, isDefault
        });
        
        if (!addresses) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        res.json({ success: true, addresses, message: 'Thêm địa chỉ thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/customer/addresses/:id
router.put('/addresses/:id', verifyToken, async (req, res) => {
    try {
        const { label, fullName, phone, address, city, postalCode, isDefault } = req.body;
        const addresses = await CustomerDAO.updateAddress(req.user.id, req.params.id, {
            label, fullName, phone, address, city, postalCode, isDefault
        });
        
        if (!addresses) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản hoặc địa chỉ' });
        res.json({ success: true, addresses, message: 'Cập nhật địa chỉ thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/customer/addresses/:id
router.delete('/addresses/:id', verifyToken, async (req, res) => {
    try {
        const addresses = await CustomerDAO.deleteAddress(req.user.id, req.params.id);
        if (!addresses) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản hoặc địa chỉ' });
        res.json({ success: true, addresses, message: 'Xóa địa chỉ thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/customer/addresses/:id/default
router.put('/addresses/:id/default', verifyToken, async (req, res) => {
    try {
        const addresses = await CustomerDAO.setDefaultAddress(req.user.id, req.params.id);
        if (!addresses) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản hoặc địa chỉ' });
        res.json({ success: true, addresses, message: 'Thiết lập địa chỉ mặc định thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== PAYMENT METHODS (cần token) ====================

// GET /api/customer/payments
router.get('/payments', verifyToken, async (req, res) => {
    try {
        const payments = await CustomerDAO.getPaymentMethods(req.user.id);
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/customer/payments
router.post('/payments', verifyToken, async (req, res) => {
    try {
        const { type, provider, cardNumber, expiryDate, nameOnCard, isDefault } = req.body;
        if (!type || !provider || !cardNumber) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin thẻ/tài khoản' });
        }
        
        const payments = await CustomerDAO.addPaymentMethod(req.user.id, {
            type, provider, cardNumber, expiryDate, nameOnCard, isDefault
        });
        
        if (!payments) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        res.json({ success: true, payments, message: 'Thêm phương thức thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/customer/payments/:id
router.delete('/payments/:id', verifyToken, async (req, res) => {
    try {
        const payments = await CustomerDAO.deletePaymentMethod(req.user.id, req.params.id);
        if (!payments) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản hoặc phương thức' });
        res.json({ success: true, payments, message: 'Xóa phương thức thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/customer/payments/:id/default
router.put('/payments/:id/default', verifyToken, async (req, res) => {
    try {
        const payments = await CustomerDAO.setDefaultPaymentMethod(req.user.id, req.params.id);
        if (!payments) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản hoặc phương thức' });
        res.json({ success: true, payments, message: 'Thiết lập phương thức mặc định thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
