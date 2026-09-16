const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrderNumber = () => `SE${Date.now()}${Math.floor(Math.random() * 90 + 10)}`;

const placeCheckoutOrder = async (req, res) => {
  try {
    const { name, email, mobile, address, pincode, paymentMethod } = req.body;
    if (!name || !email || !mobile || !address || !pincode || !paymentMethod) {
      return res.status(400).json({ message: 'Please complete delivery and payment details.' });
    }

    const cart = await Cart.find({ userId: req.user.id });
    if (!cart.length) return res.status(400).json({ message: 'Your cart is empty.' });

    const productIds = cart.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    for (const item of cart) {
      const product = productMap.get(String(item.productId));
      if (!product) return res.status(400).json({ message: `${item.title} is no longer available.` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.title} has only ${product.stock} item(s) left.` });
      }
    }

    const orderNumber = createOrderNumber();
    const isOnline = paymentMethod !== 'COD';
    const paymentStatus = isOnline ? 'Paid (Demo)' : 'Pending - Cash on Delivery';
    const transactionId = isOnline ? `DEMO-${Date.now()}` : '';
    const createdOrders = [];
    const decremented = [];

    try {
      for (const item of cart) {
        const product = productMap.get(String(item.productId));
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: product._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
        if (!updatedProduct) throw new Error(`${product.title} became unavailable. Please review your cart.`);
        decremented.push({ id: product._id, quantity: item.quantity });

        const order = await Order.create({
          userId: req.user.id,
          name, email, mobile, address, pincode,
          productId: product._id,
          title: product.title,
          description: product.description,
          mainImg: product.mainImg,
          size: item.size,
          quantity: item.quantity,
          price: product.price,
          discount: product.discount,
          paymentMethod,
          paymentStatus,
          transactionId,
          orderNumber,
          totalAmount: Math.round(product.price * item.quantity * (1 - (product.discount || 0) / 100)),
          orderDate: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          orderStatus: 'Order placed',
        });
        createdOrders.push(order);
      }

      await Cart.deleteMany({ userId: req.user.id });
      res.status(201).json({ message: 'Order placed successfully.', orderNumber, paymentStatus, orders: createdOrders });
    } catch (innerError) {
      await Promise.all(decremented.map((entry) => Product.findByIdAndUpdate(entry.id, { $inc: { stock: entry.quantity } })));
      if (createdOrders.length) await Order.deleteMany({ _id: { $in: createdOrders.map((o) => o._id) } });
      throw innerError;
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to place order.' });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { cartItemId, name, email, mobile, address, pincode, paymentMethod } = req.body;
    if (!cartItemId) return placeCheckoutOrder(req, res);
    const item = await Cart.findOne({ _id: cartItemId, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Cart item not found.' });
    const product = await Product.findById(item.productId);
    if (!product) return res.status(400).json({ message: 'Product is no longer available.' });
    if (product.stock < item.quantity) return res.status(400).json({ message: `${product.title} has only ${product.stock} item(s) left.` });
    const updated = await Product.findOneAndUpdate(
      { _id: product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updated) return res.status(400).json({ message: 'Stock changed. Please review your cart.' });
    const isOnline = paymentMethod !== 'COD';
    const order = await Order.create({
      userId: req.user.id, name, email, mobile, address, pincode,
      productId: product._id, title: product.title, description: product.description, mainImg: product.mainImg,
      size: item.size, quantity: item.quantity, price: product.price, discount: product.discount,
      paymentMethod, paymentStatus: isOnline ? 'Paid (Demo)' : 'Pending - Cash on Delivery',
      transactionId: isOnline ? `DEMO-${Date.now()}` : '', orderNumber: createOrderNumber(),
      totalAmount: Math.round(product.price * item.quantity * (1 - (product.discount || 0) / 100)),
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      orderStatus: 'Order placed',
    });
    await Cart.findOneAndDelete({ _id: item._id, userId: req.user.id });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to place order.' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (['Cancelled', 'Delivered', 'Shipped'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'This order can no longer be cancelled.' });
    }
    order.orderStatus = 'Cancelled';
    if (order.productId) await Product.findByIdAndUpdate(order.productId, { $inc: { stock: order.quantity } });
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const allowed = ['Order placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!allowed.includes(req.body.orderStatus)) return res.status(400).json({ message: 'Invalid order status.' });
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, placeCheckoutOrder, getMyOrders, cancelOrder, getAllOrders, updateOrderStatus };
