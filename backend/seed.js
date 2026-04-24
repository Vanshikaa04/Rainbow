// Run: node seed.js
// Seeds the DB with sample products (no images — add via admin panel)
require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const Admin    = require('./models/Admin');

const WA = '+919876543210'; // ← Change to your WhatsApp number

const products = [
  // CLOVE
  { name:'Clove Premium Essential Oil',   description:'Pure steam-distilled clove bud oil. Antiseptic and analgesic properties. 100% natural.',    price:349,originalPrice:499, category:'clove',    whatsappNumber:WA, featured:true,  inStock:true,  tags:['oil','natural','organic'],    rating:4.8,reviewCount:124 },
  { name:'Clove Dental Care Gel',          description:'Natural clove dental gel for cavity protection and fresh breath. Fluoride-free formula.',     price:199,originalPrice:259, category:'clove',    whatsappNumber:WA, featured:false, inStock:true,  tags:['dental','care','natural'],     rating:4.5,reviewCount:87  },
  { name:'Clove & Neem Face Pack',         description:'Deep cleansing face pack with clove and neem. Fights acne and blemishes effectively.',         price:279,               category:'clove',    whatsappNumber:WA, featured:false, inStock:true,  tags:['skincare','face','neem'],      rating:4.6,reviewCount:63  },
  { name:'Clove Whole Spice 200g',         description:'Premium whole cloves from Karnataka. Perfect for cooking, teas and home remedies.',             price:149,originalPrice:199, category:'clove',    whatsappNumber:WA, featured:false, inStock:true,  tags:['spice','cooking','kitchen'],   rating:4.7,reviewCount:210 },
  // I-FRESH
  { name:'I-Fresh Aloe Vera Gel',          description:'100% pure cold-pressed aloe vera gel. Soothes sunburn, moisturises and refreshes instantly.',  price:229,originalPrice:299, category:'i-fresh',  whatsappNumber:WA, featured:true,  inStock:true,  tags:['aloe','gel','moisturiser'],   rating:4.9,reviewCount:312 },
  { name:'I-Fresh Cucumber Face Mist',     description:'Hydrating cucumber face mist for tired skin. 200ml. Refreshes anytime, anywhere.',             price:319,               category:'i-fresh',  whatsappNumber:WA, featured:false, inStock:true,  tags:['mist','cucumber','hydration'],rating:4.4,reviewCount:98  },
  { name:'I-Fresh Green Tea Toner',        description:'Antioxidant-rich toner that tightens pores and evens skin tone. Alcohol-free.',                price:399,originalPrice:499, category:'i-fresh',  whatsappNumber:WA, featured:true,  inStock:true,  tags:['toner','green-tea','skincare'],rating:4.7,reviewCount:176 },
  { name:'I-Fresh Vitamin C Serum',        description:'Brightening Vitamin C serum reduces dark spots and boosts collagen for a radiant glow.',       price:549,originalPrice:699, category:'i-fresh',  whatsappNumber:WA, featured:false, inStock:false, tags:['serum','vitamin-c','glow'],   rating:4.8,reviewCount:245 },
  // CUTEBABY
  { name:'CuteBaby Diaper Rash Cream',     description:'Gentle zinc-based cream preventing and soothing diaper rash. Paediatrician tested.',           price:249,originalPrice:299, category:'cutebaby', whatsappNumber:WA, featured:true,  inStock:true,  tags:['diaper','baby','skin'],        rating:4.9,reviewCount:432 },
  { name:'CuteBaby Organic Shampoo',       description:'Tear-free organic baby shampoo. Sulfate and paraben free. With chamomile and calendula.',       price:299,               category:'cutebaby', whatsappNumber:WA, featured:false, inStock:true,  tags:['shampoo','organic','tear-free'],rating:4.7,reviewCount:198 },
  { name:'CuteBaby Body Lotion',           description:'Ultra-gentle moisturising lotion for newborns and toddlers. Shea butter and vitamin E.',        price:349,originalPrice:429, category:'cutebaby', whatsappNumber:WA, featured:false, inStock:true,  tags:['lotion','moisturiser','shea'], rating:4.8,reviewCount:287 },
  { name:'CuteBaby Feeding Set 6pc',       description:'BPA-free feeding set: 2 bottles, 2 spoons, 1 bowl, 1 bib. Safe for newborns 0–24 months.',    price:599,originalPrice:799, category:'cutebaby', whatsappNumber:WA, featured:true,  inStock:true,  tags:['feeding','set','bpa-free'],    rating:4.6,reviewCount:154 },
  // GENERAL
  { name:'Multi-Surface Cleaner 1L',       description:'Eco-friendly multi-surface cleaner. Removes 99.9% germs. Fresh citrus fragrance.',              price:179,originalPrice:219, category:'general',  whatsappNumber:WA, featured:false, inStock:true,  tags:['cleaner','eco','surface'],     rating:4.5,reviewCount:89  },
  { name:'Reusable Cotton Tote Bag Set',   description:'Pack of 3 organic cotton tote bags. Sturdy handles, machine washable, eco-friendly.',           price:299,               category:'general',  whatsappNumber:WA, featured:false, inStock:true,  tags:['eco','bag','reusable'],        rating:4.6,reviewCount:67  },
  { name:'Bamboo Toothbrush Set 4pc',      description:'Biodegradable bamboo toothbrushes with BPA-free bristles. Eco-conscious oral care.',            price:199,originalPrice:249, category:'general',  whatsappNumber:WA, featured:true,  inStock:true,  tags:['bamboo','oral-care','eco'],    rating:4.7,reviewCount:143 },
  { name:'Stainless Steel Bottle 1L',      description:'Double-wall insulated bottle. Cold 24hr / Hot 12hr. BPA-free, leak-proof lid.',                 price:499,originalPrice:699, category:'general',  whatsappNumber:WA, featured:false, inStock:true,  tags:['bottle','insulated','steel'],  rating:4.8,reviewCount:322 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Atlas connected');

  await Product.deleteMany({});
  const created = await Product.insertMany(products);
  console.log(`✅ ${created.length} products seeded (no images — add via admin panel)`);

  const count = await Admin.countDocuments();
  if (count === 0) {
    await Admin.create({ username:'admin', email:'admin@rainbow.com', password:'rainbow123' });
    console.log('✅ Admin created — username: admin | password: rainbow123');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  console.log('🌈 Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });