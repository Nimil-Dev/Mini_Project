const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['student', 'faculty', 'alumni'],
    lowercase: true,
    default: 'student' 
  },
  avatar: { type: String, default: '' } // 👈 Add this field
});

module.exports = mongoose.model('User', userSchema);