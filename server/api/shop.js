const express = require('express');
const router = express.Router();
const ProductDAO = require('../models/ProductDAO');
const CategoryDAO = require('../models/CategoryDAO');

// GET /shop — Danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const result = await ProductDAO.selectAll(page, 12, { status: 'active' });
        const categories = await CategoryDAO.selectAll();
        res.render('product-list', {
            products: result.products,
            categories,
            currentPage: result.page,
            totalPages: result.totalPages,
            total: result.total,
        });
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});

// GET /shop/product/:id — Chi tiết sản phẩm
router.get('/product/:id', async (req, res) => {
    try {
        const product = await ProductDAO.selectById(req.params.id);
        if (!product) {
            return res.status(404).send('Không tìm thấy sản phẩm');
        }
        res.render('product-detail', { product });
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});

// GET /shop/cart — Giỏ hàng
router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
});

// POST /shop/cart/add — Thêm vào giỏ
router.post('/cart/add', async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const product = await ProductDAO.selectById(productId);
        if (!product) {
            return res.status(404).send('Không tìm thấy sản phẩm');
        }

        if (!req.session.cart) req.session.cart = [];

        const existingIndex = req.session.cart.findIndex(
            (item) => item.productId === productId
        );

        if (existingIndex >= 0) {
            req.session.cart[existingIndex].quantity += Number(quantity);
        } else {
            req.session.cart.push({
                productId: product._id.toString(),
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: Number(quantity),
            });
        }

        res.redirect('/shop/cart');
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});

// POST /shop/cart/remove/:id — Xóa khỏi giỏ
router.post('/cart/remove/:id', (req, res) => {
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(
            (item) => item.productId !== req.params.id
        );
    }
    res.redirect('/shop/cart');
});

module.exports = router;
