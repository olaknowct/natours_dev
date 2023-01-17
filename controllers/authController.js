const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  // input only the data required. this help the code more secured.
  // ex. we are not allowin them to be an admin since its selected data only
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const jwtPayload = { id: newUser._id };
  // 1st paramter: payload - all object data you want to store
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
