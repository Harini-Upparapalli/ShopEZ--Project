const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Admin = require('../models/Admin');

// =========================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// =========================================================

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      usertype: 'Customer',
    });

    const allProducts = await Product.countDocuments();

    const allOrders = await Order.countDocuments();

    // -----------------------------------------------------
    // Revenue
    // -----------------------------------------------------

    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: 'Cancelled',
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: {
              $ifNull: ['$totalAmount', 0],
            },
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].revenue
        : 0;

    // -----------------------------------------------------
    // Order status counts
    // -----------------------------------------------------

    const statusResult = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const orderStatus = {
      'Order placed': 0,
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0,
    };

    statusResult.forEach((item) => {
      if (item._id) {
        orderStatus[item._id] = item.count;
      }
    });

    // -----------------------------------------------------
    // Recent orders
    // -----------------------------------------------------

    const recentOrders = await Order.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select(
        'orderNumber title quantity totalAmount orderStatus paymentMethod createdAt'
      )
      .lean();

    // -----------------------------------------------------
    // Category-wise sales
    // -----------------------------------------------------

    const categoryResult =
      await Order.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: 'Cancelled',
            },
          },
        },

        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product',
          },
        },

        {
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              $ifNull: [
                '$product.category',
                'Other',
              ],
            },

            orders: {
              $sum: 1,
            },

            revenue: {
              $sum: {
                $ifNull: [
                  '$totalAmount',
                  0,
                ],
              },
            },
          },
        },

        {
          $sort: {
            revenue: -1,
          },
        },
      ]);

    const categorySales =
      categoryResult.map((item) => ({
        category: item._id,
        orders: item.orders,
        revenue: Math.round(
          item.revenue || 0
        ),
      }));

    // -----------------------------------------------------
    // Inventory information
    // -----------------------------------------------------

    const outOfStockProducts =
      await Product.find({
        stock: {
          $lte: 0,
        },
      })
        .select(
          'title category stock price mainImg'
        )
        .sort({
          stock: 1,
          title: 1,
        })
        .limit(10)
        .lean();

    const lowStockProducts =
      await Product.find({
        stock: {
          $gt: 0,
          $lte: 5,
        },
      })
        .select(
          'title category stock price mainImg'
        )
        .sort({
          stock: 1,
          title: 1,
        })
        .limit(10)
        .lean();

    const outOfStockCount =
      await Product.countDocuments({
        stock: {
          $lte: 0,
        },
      });

    const lowStockCount =
      await Product.countDocuments({
        stock: {
          $gt: 0,
          $lte: 5,
        },
      });

    // -----------------------------------------------------
    // Response
    // -----------------------------------------------------

    res.status(200).json({
      totalUsers,
      allProducts,
      allOrders,

      totalRevenue: Math.round(
        totalRevenue
      ),

      orderStatus,

      recentOrders,

      categorySales,

      inventory: {
        outOfStockCount,
        lowStockCount,
        outOfStockProducts,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error(
      'Dashboard stats error:',
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================================
// GET ALL USERS
// GET /api/admin/users
// =========================================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      usertype: 'Customer',
    }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================================
// GET SETTINGS
// GET /api/admin/settings
// =========================================================

const getSettings = async (req, res) => {
  try {
    let settings =
      await Admin.findOne();

    if (!settings) {
      settings = await Admin.create({
        banner: '',
        categories: [],
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================================
// UPDATE SETTINGS
// PUT /api/admin/settings
// =========================================================

const updateSettings = async (req, res) => {
  try {
    let settings =
      await Admin.findOne();

    if (!settings) {
      settings = await Admin.create(
        req.body
      );
    } else {
      settings =
        await Admin.findByIdAndUpdate(
          settings._id,
          req.body,
          {
            new: true,
          }
        );
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================================
// EXPORT
// =========================================================

module.exports = {
  getDashboardStats,
  getAllUsers,
  getSettings,
  updateSettings,
};