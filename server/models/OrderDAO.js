const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        items: [orderItemSchema],
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
            default: 'pending',
        },
        shippingAddress: {
            type: String,
            default: '',
        },
        note: {
            type: String,
            default: '',
        },
        paymentMethod: {
            type: String,
            default: 'Thanh toán trực tiếp',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

const OrderDAO = {
    selectAll: async (page = 1, limit = 20) => {
        const orders = await Order.find()
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Order.countDocuments();
        return { orders, total, page: Number(page), totalPages: Math.ceil(total / limit) };
    },

    selectById: async (id) => {
        return await Order.findById(id)
            .populate('customer', 'name email phone')
            .populate('items.product');
    },

    selectByCustomer: async (customerId) => {
        return await Order.find({ customer: customerId })
            .populate('items.product')
            .sort({ createdAt: -1 });
    },

    insert: async (data) => {
        const order = new Order(data);
        return await order.save();
    },

    updateStatus: async (id, status) => {
        return await Order.findByIdAndUpdate(id, { status }, { new: true });
    },

    delete: async (id) => {
        return await Order.findByIdAndDelete(id);
    },

    deleteByCustomer: async (customerId) => {
        return await Order.deleteMany({ customer: customerId });
    },
};

module.exports = OrderDAO;
