const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../db/User');

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      status: false,
      message: "Email and password are required!",
    });
  }
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({
      status: false,
      message: "Invalid Email or password",
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '12h',
  });
  res.json({
    status: true,
    message: "Login Successfully!",
    token,
  });
});

exports.signup = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  let isAlready = await User.findOne({ email });
  if (isAlready) {
    return res.status(200).json({
      status: false,
      message: "User already exists!",
    });
  }
  const record = new User({
    email,
    password,
  });
  const result = await record.save();
  if (result) {
    res.json({
      status: true,
      message: "You have been registered successfully !!.",
    });
  } else {
    res.json({
      status: false,
      error: result,
      message: "Failed to create user.",
    });
  }
});