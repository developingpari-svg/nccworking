const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userdata')
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  age: Number
});

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.user || mongoose.model('user', userSchema);
