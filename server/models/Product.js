const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String },
  mpn: { type: String },
  price: { type: Number, required: true },
  in_stock: { type: Boolean, default: true },
  currency: { type: String },
  brand: { type: String },
  description: { type: String },
  images: [{ type: String }],
  gender: { type: String },
});

module.exports = mongoose.model('Product', productSchema);
