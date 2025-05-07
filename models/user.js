const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  role: { type: String, default: 'author' }, // Example: admin, author, guest
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
