const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // filename from multer
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional if user system
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
