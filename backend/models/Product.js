const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true }, // Cloudinary public_id for deletion
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: false},
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ['clove', 'i-fresh', 'cutebaby', 'general'],
    lowercase: true,
  },
  images: [imageSchema],
  whatsappNumber: { type: String,  default: '+919825017709' },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  tags: [String],
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);