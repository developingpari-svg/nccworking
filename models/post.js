const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.models.post || mongoose.model('post', postSchema);
