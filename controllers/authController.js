const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role, passwordConfirm, passwordChangedAt } =
    req.body;
  // input only the data required. this help the code more secured.
  // ex. we are not allowin them to be an admin since its selected data only
  const newUser = await User.create({
    name,
    email,
    role,
    password,
    passwordConfirm,
    passwordChangedAt,
  });

  // 1st paramter: payload - all object data you want to store
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password Exist
  if (!email || !password) {
    return next(new AppError('Please Provide Email and Password', 400));
  }
  // 2. Check if user exist && password is correct
  // we explicitly selected the password
  const user = await User.findOne({ email }).select('+password');

  // if user exist we can run the second or
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3. if everyging ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1. Get Token and check if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // 401 - unauthorize
    return next(
      new AppError('You are not logged in! Please Log in to get access', 401)
    );
  }

  // 2. Validate/Verification Token
  // jwt verify is synchrounous function
  // The promisify() function will return a version Promise of your function
  // verify if someone manipulated the data or also if token has already expired
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3. Check if user still exists
  // if user is deleted , dont authorize the previous token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exists',
        401
      )
    );
  }
  // 4. Check if user changed password after the token was issued
  // we dont authorize client if password is changed, token should be invalid if token retrieved before password is changed
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again.', 401)
    );
  }

  // Grant Access to protected Route if reached
  req.user = currentUser;
  next();
});

// closure, since from the routes we are calling and passing the arguments,
// this function will return a middleware function
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        // 403 - forbidden
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get User based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with email address', 404));

  // Gnerate random reset token
  const resetToken = user.createPasswordResetToken();
  // we are trying to save a doc but we did not specify all the mandatory data (required)
  // use special option to neglect mandatory data
  await user.save({ validateBeforeSave: false });
  // sent it to users email
});
exports.resetPassword = (req, res, next) => {};
