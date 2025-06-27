const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },

  // ❌ REMOVE this line if not using email
  // email: { type: String, unique: true },
});

module.exports = mongoose.model('User', UserSchema);
