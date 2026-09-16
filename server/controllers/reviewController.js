const Review = require('../models/Review');
const Product = require('../models/Product');

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    const summary = reviews.reduce((acc, review) => {
      acc.count += 1;
      acc.total += review.rating;
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, { count: 0, total: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    summary.average = summary.count ? Number((summary.total / summary.count).toFixed(1)) : 0;
    delete summary.total;
    res.json({ reviews, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    if (!comment || !comment.trim()) return res.status(400).json({ message: 'Please write a review.' });

    const review = await Review.findOneAndUpdate(
      { productId: product._id, userId: req.user.id },
      { productId: product._id, userId: req.user.id, username: req.user.username || 'Customer', rating: numericRating, comment: comment.trim() },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.json({ message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProductReviews, createReview, deleteReview };
