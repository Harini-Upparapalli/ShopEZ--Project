const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    let wishlist = await Wishlist.findOne({ userId }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [],
      });
    }

    res.json({
      success: true,
      products: wishlist.products,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load wishlist",
    });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          products: productId,
        },
      },
      {
        new: true,
        upsert: true,
      }
    ).populate("products");

    res.json({
      success: true,
      message: "Product added to wishlist",
      products: wishlist.products,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $pull: {
          products: productId,
        },
      },
      {
        new: true,
      }
    ).populate("products");

    res.json({
      success: true,
      message: "Product removed from wishlist",
      products: wishlist ? wishlist.products : [],
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};