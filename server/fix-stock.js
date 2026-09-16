const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

async function fixStock() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const result = await Product.updateMany(
      {},
      { $set: { stock: 20 } }
    );

    console.log("Products updated:", result.modifiedCount);
    console.log("Stock set to 20 for all catalog products.");

    await mongoose.disconnect();

    console.log("STOCK FIX COMPLETED");
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
}

fixStock();