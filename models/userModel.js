const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    required: [true, 'Must match password'],
    validate: {
      // This only works on CREATE AND SAVE
      validator: function(el){
        return el === this.password;
      },
      message: 'Password must match'
    }
  }
});

userSchema.pre('save', async function(next){
  // Only run this function if password was modified
  if(!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
