const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select('stock price discount title mainImg');
    const productMap = new Map(products.map((p) => [String(p._id), p]));
    res.json(items.map((item) => {
      const product = productMap.get(String(item.productId));
      return {
        ...item.toObject(),
        stock: product?.stock ?? 0,
        currentPrice: product?.price ?? item.price,
        currentDiscount: product?.discount ?? item.discount,
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    const qty = Math.max(1, Number(quantity) || 1);
    if (product.stock <= 0) return res.status(400).json({ message: 'This product is out of stock.' });

    const existing = await Cart.findOne({ userId: req.user.id, productId, size });
    const nextQty = (existing?.quantity || 0) + qty;
    if (nextQty > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} item(s) are available.` });
    }

    if (existing) {
      existing.quantity = nextQty;
      existing.title = product.title;
      existing.mainImg = product.mainImg;
      existing.price = product.price;
      existing.discount = product.discount;
      await existing.save();
      return res.json(existing);
    }

    const item = await Cart.create({
      userId: req.user.id,
      productId: product._id,
      title: product.title,
      mainImg: product.mainImg,
      size,
      quantity: qty,
      price: product.price,
      discount: product.discount,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const item = await Cart.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    const product = await Product.findById(item.productId);
    if (!product) return res.status(404).json({ message: 'Product no longer exists.' });
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1.' });
    if (quantity > product.stock) return res.status(400).json({ message: `Only ${product.stock} item(s) are available.` });
    item.quantity = quantity;
    item.price = product.price;
    item.discount = product.discount;
    await item.save();
    res.json({ ...item.toObject(), stock: product.stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
