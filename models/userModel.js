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
    minlength: 8,
    select: false
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
  },
  passwordChangedAt: Date
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

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  // False = NOT changed
  return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
