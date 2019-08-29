const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });
};

exports.signup = catchAsync(async(req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);


  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // const email = req.body.email;
  const { email, password } = req.body;   // using destructuring

  // 1. check if email and password exist
  if(!email || !password){
    return next(new AppError('Please provide email and password', 400));
  }
  // 2. Check if user exists and password is correct
  const user = await User.findOne({email}).select('+password');

  if(!user || !(await user.correctPassword(password, user.password))){
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3. If ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check if it exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
 console.log(token);
  if(!token){
    return next(new AppError('You are not logged in', 401));
  }
  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if(!currentUser){
    return next(new AppError('This user no longer exists, please re-register', 401));
  }
  // 4. Check if user changed password after token issued
  if(currentUser.changedPasswordAfter(decoded.iat)){
    return next(new AppError('User recently changed password! Please log in again', 401));
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide'], role='user'
    if(!roles.includes(req.user.role)){
      return next(new AppError('You do not have permission to perform this action', 403))
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async(req, res, next) => {
  // 1 Get user based on Posted isEmail
  const user = await User.findOne({ email: req.body.email });
  if(!user){
    return next(new AppError('Email does not match anyone our system', 404));
  }
  // 2 Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3 Send to user's email
});
exports.resetPassword = (req, res, next) => {}
