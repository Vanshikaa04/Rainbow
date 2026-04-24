const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

/* ─── Helper: upload buffer to Cloudinary ─────────────────── */
const uploadToCloudinary = (buffer, folder = 'rainbow/products') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (err, result) => { if (err) reject(err); else resolve(result); }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/* ─── Auth ────────────────────────────────────────────────── */

// Register first admin only
router.post('/register', async (req, res) => {
  try {
    if (await Admin.countDocuments() > 0)
      return res.status(403).json({ message: 'Admin already exists. Use login.' });
    const admin = await Admin.create(req.body);
    res.status(201).json({ message: 'Admin created', admin: { id: admin._id, username: admin.username } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'rainbow_secret',
      { expiresIn: '7d' }
    );
    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Verify token
router.get('/verify', protect, (req, res) => res.json({ valid: true, admin: req.admin }));

/* ─── Products ────────────────────────────────────────────── */

// GET all
router.get('/products', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CREATE product — images uploaded to Cloudinary only on form submit
router.post('/products', protect, upload.array('images', 5), async (req, res) => {
  try {
    let images = [];

    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
      images = uploads.map(r => ({ url: r.secure_url, public_id: r.public_id }));
    }

    const { tags, ...rest } = req.body;
    const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const product = await Product.create({ ...rest, images, tags: tagArr });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// UPDATE product — append new images, keep existing ones
router.put('/products/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { tags, keepImages, ...rest } = req.body;
    const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    // keepImages is a JSON string of image objects the client wants to retain
    let keptImages = [];
    if (keepImages) {
      try { keptImages = JSON.parse(keepImages); } catch { keptImages = []; }
    }

    // Delete images that were removed by user
    const keptIds = keptImages.map(i => i.public_id);
    const toDelete = product.images.filter(i => !keptIds.includes(i.public_id));
    if (toDelete.length > 0) {
      await Promise.all(toDelete.map(i => cloudinary.uploader.destroy(i.public_id)));
    }

    // Upload new images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
      newImages = uploads.map(r => ({ url: r.secure_url, public_id: r.public_id }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...rest, tags: tagArr, images: [...keptImages, ...newImages] },
      { new: true, runValidators: true }
    );
    res.json(updatedProduct);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE single image from a product (removes from Cloudinary + DB)
router.delete('/products/:id/images/:publicId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const publicId = decodeURIComponent(req.params.publicId);

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from DB
    product.images = product.images.filter(img => img.public_id !== publicId);
    await product.save();

    res.json({ message: 'Image deleted', images: product.images });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE product (removes all images from Cloudinary too)
router.delete('/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete all images from Cloudinary
    if (product.images.length > 0) {
      await Promise.all(product.images.map(img => cloudinary.uploader.destroy(img.public_id)));
    }

    await product.deleteOne();
    res.json({ message: 'Product and all images deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// STATS
router.get('/stats', protect, async (req, res) => {
  try {
    const [total, featured, inStock, byCategory] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ inStock: true }),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    res.json({ total, featured, inStock, byCategory });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;