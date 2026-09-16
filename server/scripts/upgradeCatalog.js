const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopzone';

const catalog = [
  // ==================== MOBILES (10) ====================
  {
    title: 'Smart Touchscreen Smartphone 5G',
    description: 'Fast 5G smartphone with a bright AMOLED display, long battery life and smooth everyday performance.',
    mainImg: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    category: 'Mobiles',  price: 34999, discount: 15, sizes: ['128GB', '256GB']
  },
  {
    title: 'Flagship Smartphone Pro 256GB',
    description: 'Premium smartphone with a high-resolution camera, powerful processor and elegant glass design.',
    mainImg: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
    category: 'Mobiles',  price: 54999, discount: 12, sizes: ['256GB', '512GB']
  },
  {
    title: 'Foldable Ultra-Compact Smartphone',
    description: 'Modern foldable smartphone with a flexible display, powerful performance and compact design.',
    mainImg: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
    category: 'Mobiles',  price: 89999, discount: 8, sizes: ['256GB']
  },
  {
    title: 'Slim Profile Quad-Camera Smartphone',
    description: 'Slim smartphone with a versatile quad-camera setup, fast charging and a vivid display.',
    mainImg: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
    category: 'Mobiles',  price: 24999, discount: 15, sizes: ['128GB']
  },
  {
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Premium titanium smartphone with advanced camera features, fast performance and a high-quality display.',
    mainImg: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800',
    category: 'Mobiles',  price: 134900, discount: 8, sizes: ['256GB', '512GB']
  },
  {
    title: 'Samsung Galaxy S24 Ultra 5G',
    description: 'Flagship Android smartphone with an advanced camera system, S Pen and high-performance processor.',
    mainImg: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
    category: 'Mobiles',  price: 129999, discount: 10, sizes: ['256GB', '512GB']
  },
  {
    title: 'OnePlus 13 5G',
    description: 'High-performance 5G phone with a smooth display, fast charging and powerful camera system.',
    mainImg: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    category: 'Mobiles',  price: 69999, discount: 10, sizes: ['256GB', '512GB']
  },
  {
    title: 'Google Pixel 9 Pro',
    description: 'Smartphone with an advanced camera system, clean software experience and bright OLED display.',
    mainImg: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800',
    category: 'Mobiles',  price: 109999, discount: 7, sizes: ['128GB', '256GB']
  },
  {
    title: 'Vivo V40 5G',
    description: 'Stylish 5G smartphone with a high-refresh-rate display, fast charging and portrait photography.',
    mainImg: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
    category: 'Mobiles',  price: 34999, discount: 14, sizes: ['128GB', '256GB']
  },
  {
    title: 'Redmi Note 14 Pro 5G',
    description: 'Value-focused 5G smartphone with a sharp display, capable camera and large battery.',
    mainImg: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800',
    category: 'Mobiles',  price: 26999, discount: 16, sizes: ['128GB', '256GB']
  },

  // ==================== ELECTRONICS (10) ====================
  {
    title: 'Wireless Stereo Headphones',
    description: 'Comfortable wireless headphones with rich audio, soft ear cushions and long playback time.',
    mainImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    category: 'Electronics',  price: 4999, discount: 20, sizes: ['Standard']
  },
  {
    title: 'Smart Fitness Tracker Band',
    description: 'Fitness band for tracking steps, workouts, heart rate and daily activity.',
    mainImg: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800',
    category: 'Electronics',  price: 2999, discount: 18, sizes: ['One Size']
  },
  {
    title: '4K Ultra HD Smart LED Display',
    description: 'Large smart display with vivid picture quality, HDR support and modern streaming features.',
    mainImg: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800',
    category: 'Electronics',  price: 42990, discount: 22, sizes: ['50 Inch', '55 Inch']
  },
  {
    title: 'Portable Bluetooth Soundbar Speaker',
    description: 'Compact Bluetooth speaker with clear vocals, rich bass and convenient wireless connectivity.',
    mainImg: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    category: 'Electronics',  price: 3499, discount: 14, sizes: ['Standard']
  },
  {
    title: 'MacBook Pro 16 M3 Max',
    description: 'Powerful professional laptop with a large high-resolution display and high-performance Apple silicon.',
    mainImg: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    category: 'Electronics',  price: 249900, discount: 5, sizes: ['36GB/1TB', '48GB/1TB']
  },
  {
    title: 'Portable Digital Writing Tablet',
    description: 'Lightweight digital writing tablet for notes, sketches, study and creative work.',
    mainImg: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800',
    category: 'Electronics',  price: 1299, discount: 18, sizes: ['Standard']
  },
  {
    title: 'Mini HD Home Projector',
    description: 'Compact projector for movies, presentations and entertainment with a portable design.',
    mainImg: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=800',
    category: 'Electronics',  price: 6499, discount: 20, sizes: ['Standard']
  },
  {
    title: 'Smart LED Desk Lamp',
    description: 'Modern adjustable desk lamp suitable for studying, working and reading.',
    mainImg: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    category: 'Electronics',  price: 1599, discount: 15, sizes: ['Standard']
  },
  {
    title: 'Wireless Mechanical Keyboard',
    description: 'Compact mechanical keyboard with wireless connectivity and comfortable tactile keys.',
    mainImg: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    category: 'Electronics',  price: 3999, discount: 18, sizes: ['Standard']
  },
  {
    title: '1080p USB Webcam',
    description: 'Full HD webcam for online classes, meetings and video calls with a clear wide-angle view.',
    mainImg: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
    category: 'Electronics',  price: 2299, discount: 12, sizes: ['Standard']
  },

  // ==================== FASHION (10) ====================
  {
    title: 'Men Casual Cotton T-Shirt',
    description: 'Soft everyday cotton T-shirt with a comfortable regular fit and easy-care fabric.',
    mainImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    category: 'Fashion', gender: 'Men', price: 1299, discount: 25, sizes: ['S', 'M', 'L', 'XL']
  },
  {
    title: 'Women Elegant Summer Dress',
    description: 'Comfortable flowy dress with a stylish silhouette, ideal for casual outings and summer days.',
    mainImg: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    category: 'Fashion', gender: 'Women', price: 2799, discount: 30, sizes: ['S', 'M', 'L']
  },
  {
    title: 'Men Stylish Leather Jacket',
    description: 'Classic jacket design with a premium finish, zip closure and comfortable inner lining.',
    mainImg: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    category: 'Fashion', gender: 'Men', price: 5999, discount: 25, sizes: ['M', 'L', 'XL']
  },
  {
    title: 'Women Trendy Leather Shoulder Bag',
    description: 'Spacious shoulder bag with a polished finish, practical storage and elegant styling.',
    mainImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
    category: 'Fashion', gender: 'Women', price: 3299, discount: 35, sizes: ['Standard']
  },
  {
    title: 'Women Soft Silk Printed Saree',
    description: 'Elegant printed soft silk saree with a graceful traditional look for festive occasions.',
    mainImg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    category: 'Fashion', gender: 'Women', price: 3499, discount: 35, sizes: ['Free Size']
  },
  {
    title: 'Men Slim Fit Casual Shirt',
    description: 'Smart casual shirt made for comfortable everyday office and weekend styling.',
    mainImg: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
    category: 'Fashion', gender: 'Men', price: 1799, discount: 22, sizes: ['S', 'M', 'L', 'XL']
  },
  {
    title: 'Women Embroidered Kurta',
    description: 'Comfortable ethnic kurta with detailed embroidery and an elegant everyday fit.',
    mainImg: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
    category: 'Fashion', gender: 'Women', price: 2199, discount: 28, sizes: ['S', 'M', 'L', 'XL']
  },
  {
    title: 'Men Regular Fit Denim Jeans',
    description: 'Durable denim jeans with a versatile regular fit for casual daily wear.',
    mainImg: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    category: 'Fashion', gender: 'Men', price: 2499, discount: 20, sizes: ['30', '32', '34', '36']
  },
  {
    title: 'Women Pink Party Dress',
    description: 'Stylish party dress with an elegant finish designed for celebrations and evening events.',
    mainImg: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
    category: 'Fashion', gender: 'Women', price: 2499, discount: 28, sizes: ['S', 'M', 'L']
  },
  {
    title: 'Men Classic Sports Sneakers',
    description: 'Lightweight everyday sneakers with cushioned support and a versatile casual design.',
    mainImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    category: 'Fashion',  price: 2999, discount: 25, sizes: ['6', '7', '8', '9', '10'], gender: 'Men'
  },

  // ==================== GROCERIES (10) ====================
  {
    title: 'Organic Green Tea Selection',
    description: 'Aromatic green tea leaves selected for a refreshing drink with a naturally smooth taste.',
    mainImg: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    category: 'Groceries',  price: 450, discount: 5, sizes: ['250g', '500g']
  },
  {
    title: 'Extra Virgin Cold Pressed Olive Oil',
    description: 'Premium olive oil suitable for cooking, dressings and everyday healthy meals.',
    mainImg: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800',
    category: 'Groceries',  price: 1199, discount: 10, sizes: ['500ml', '1L']
  },
  {
    title: 'Aromatic Premium Basmati Rice 5kg',
    description: 'Long-grain aromatic Basmati rice suitable for biryani, pulao and everyday family meals.',
    mainImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
    category: 'Groceries',  price: 799, discount: 12, sizes: ['5kg']
  },
  {
    title: 'Raw California Whole Almonds 500g',
    description: 'Crunchy premium almonds suitable for snacking, baking and healthy daily diets.',
    mainImg: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800',
    category: 'Groceries',  price: 649, discount: 18, sizes: ['500g']
  },
  {
    title: 'Pure Raw Organic Honey 500g',
    description: 'Pure natural honey with a rich taste, suitable for breakfast, drinks and cooking.',
    mainImg: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800',
    category: 'Groceries',  price: 499, discount: 10, sizes: ['500g', '1kg']
  },
  {
    title: 'Tata Salt 1kg',
    description: 'Everyday iodised cooking salt packed for convenient household use.',
    mainImg: 'https://images.unsplash.com/photo-1518110925495-5fe2a2c6f4b8?w=800',
    category: 'Groceries',  price: 32, discount: 5, sizes: ['1kg']
  },
  {
    title: 'Instant Noodles Family Pack',
    description: 'Quick-to-cook noodles for convenient snacks and easy family meals.',
    mainImg: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    category: 'Groceries',  price: 120, discount: 8, sizes: ['5 Pack', '10 Pack']
  },
  {
    title: 'Premium Mixed Dry Fruits',
    description: 'Tasty mixed dry fruits packed for snacking, gifting and everyday nutrition.',
    mainImg: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800',
    category: 'Groceries',  price: 499, discount: 12, sizes: ['250g', '500g']
  },
  {
    title: 'Fortune Sunflower Cooking Oil 1L',
    description: 'Light cooking oil suitable for everyday frying and home-style recipes.',
    mainImg: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800',
    category: 'Groceries',  price: 145, discount: 8, sizes: ['1L', '5L']
  },
  {
    title: 'Whole Wheat Atta 5kg',
    description: 'Everyday whole wheat flour for soft rotis, chapatis and homemade breads.',
    mainImg: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    category: 'Groceries',  price: 299, discount: 10, sizes: ['5kg', '10kg']
  },

  // ==================== SPORTS-EQUIPMENT (10) ====================
  {
    title: 'Professional Training Soccer Ball',
    description: 'Durable training football with reliable grip and control for practice and recreational play.',
    mainImg: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800',
    category: 'Sports-Equipment',  price: 1899, discount: 10, sizes: ['Size 5']
  },
  {
    title: 'Carbon Fiber Tennis Racket',
    description: 'Lightweight tennis racket designed for comfortable handling, control and powerful shots.',
    mainImg: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800',
    category: 'Sports-Equipment',  price: 8999, discount: 15, sizes: ['Grip 2', 'Grip 3']
  },
  {
    title: 'Adjustable Fitness Dumbbell Set 20kg',
    description: 'Home workout dumbbell set with adjustable weights and comfortable non-slip grips.',
    mainImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800',
    category: 'Sports-Equipment',  price: 4499, discount: 20, sizes: ['20kg Set']
  },
  {
    title: 'Vector X Training Resistance Bands Set',
    description: 'Set of resistance bands for strength training, stretching and home workouts.',
    mainImg: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800',
    category: 'Sports-Equipment',  price: 799, discount: 20, sizes: ['Set of 5']
  },
  {
    title: 'Cricket Ball Set',
    description: 'Durable cricket balls suitable for practice sessions, training and recreational matches.',
    mainImg: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    category: 'Sports-Equipment',  price: 599, discount: 15, sizes: ['Set of 3']
  },
  {
    title: 'Yoga Mat with Carry Strap',
    description: 'Comfortable non-slip exercise mat with a carry strap for yoga, stretching and workouts.',
    mainImg: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800',
    category: 'Sports-Equipment',  price: 899, discount: 18, sizes: ['6mm']
  },
  {
    title: 'Adjustable Skipping Rope',
    description: 'Lightweight skipping rope with adjustable length for cardio, fitness and warm-up routines.',
    mainImg: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800',
    category: 'Sports-Equipment',  price: 399, discount: 15, sizes: ['Standard']
  },
  {
    title: 'Football Training Cones Set',
    description: 'Bright training cones for football drills, agility practice and sports coaching.',
    mainImg: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
    category: 'Sports-Equipment',  price: 699, discount: 12, sizes: ['Set of 20']
  },
  {
    title: 'Badminton Racket Pair',
    description: 'Lightweight badminton racket pair suitable for beginners, practice and casual games.',
    mainImg: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
    category: 'Sports-Equipment',  price: 1599, discount: 20, sizes: ['Pair']
  },
  {
    title: 'Sports Water Bottle 1L',
    description: 'Reusable sports bottle with a convenient carry design for gym, running and outdoor activities.',
    mainImg: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    category: 'Sports-Equipment',  price: 499, discount: 10, sizes: ['1L']
  }
];

async function run() {
  try {
    await mongoose.connect(mongoURI);
    console.log(`Connected to ${mongoURI}`);

    const existing = await Product.find({}).sort({ createdAt: 1, _id: 1 });
    if (existing.length > 25) {
      console.log(`STOP: Found ${existing.length} products. This script expects the current 25-product catalog.`);
      console.log('No changes were made.');
      return;
    }

    let updated = 0;
    let created = 0;

    // Update existing records in place so their MongoDB _id values are preserved.
    for (let i = 0; i < existing.length; i += 1) {
      const item = catalog[i];
      Object.assign(existing[i], item);
      await existing[i].save();
      updated += 1;
    }

    // Add the remaining products.
    for (let i = existing.length; i < catalog.length; i += 1) {
      await Product.create(catalog[i]);
      created += 1;
    }

    console.log(`\nCatalog upgrade complete. Updated: ${updated}, Created: ${created}`);

    const categories = ['Mobiles', 'Electronics', 'Fashion', 'Groceries', 'Sports-Equipment'];
    let total = 0;
    console.log('\n--- PRODUCT COUNTS ---');
    for (const category of categories) {
      const count = await Product.countDocuments({ category });
      total += count;
      console.log(`${category}: ${count}`);
    }
    console.log(`Total products: ${total}`);

    if (total === 50) {
      console.log('\nSUCCESS: ShopEZ now has the 50-product catalog.');
    }
  } catch (error) {
    console.error('Catalog upgrade failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
