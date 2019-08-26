const mongoose = require('mongoose');
const validator = require('validator');

// Create schema with the following: name, email, photo, password, password confirmation
const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: [true, 'Enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email']
  },
  photo: String,

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Must match password']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
