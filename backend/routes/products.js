const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, limit = 30, page = 1 } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(query),
    ]);
    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET featured
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(8);
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET latest
router.get('/latest', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET recommended (same category, exclude current, limit 6)
router.get('/:id/recommended', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    const recommended = await Product.find({ category: product.category, _id: { $ne: product._id } })
      .sort({ createdAt: -1 }).limit(6);
    res.json(recommended);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET browse other categories (3 products each from other 3 categories)
router.get('/:id/browse-others', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    const allCats = ['clove', 'i-fresh', 'cutebaby', 'general'];
    const others = allCats.filter(c => c !== product.category);

    const results = await Promise.all(
      others.map(cat => Product.find({ category: cat }).sort({ createdAt: -1 }).limit(3))
    );

    const grouped = {};
    others.forEach((cat, i) => { grouped[cat] = results[i]; });
    res.json(grouped);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;