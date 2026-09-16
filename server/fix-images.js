const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const fixes = {
  "Women Embroidered Kurta":
    "https://images.unsplash.com/photo-1742800788220-1e42256d6022?auto=format&fit=crop&w=800",

  "Pure Raw Organic Honey 500g":
    "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800",

  "Samsung Galaxy S24 Ultra 5G":
    "https://images.unsplash.com/photo-1628251766155-6292b0b5f2d0?auto=format&fit=crop&w=800",

  "Slim Profile Quad-Camera Smartphone":
    "https://images.unsplash.com/photo-1628251766155-6292b0b5f2d0?auto=format&fit=crop&w=800"
};

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");
    console.log("Updating broken product images...\n");

    for (const [title, mainImg] of Object.entries(fixes)) {
      const result = await Product.updateOne(
        { title },
        { $set: { mainImg } }
      );

      if (result.modifiedCount) {
        console.log("UPDATED:", title);
      } else if (result.matchedCount) {
        console.log("ALREADY UPDATED:", title);
      } else {
        console.log("NOT FOUND:", title);
      }
    }

    await mongoose.disconnect();

    console.log("\nIMAGE REPAIR COMPLETED");
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
}

fixImages();