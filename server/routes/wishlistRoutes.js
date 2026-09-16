const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Get logged-in user's wishlist
router.get("/", protect, getWishlist);

// Add product to wishlist
router.post("/:productId", protect, addToWishlist);

// Remove product from wishlist
router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;