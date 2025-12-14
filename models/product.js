const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  shortDescription: String,
  photo: String
});

module.exports = mongoose.models.product || mongoose.model('product', productSchema);
