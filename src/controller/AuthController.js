const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../db/User');
const multer = require('multer');
const upload = multer();

exports.login = catchAsync(async (req, res, next) => {
  upload.none()(req, res, async function (err) {
    if (err) {
      return next(new AppError('Error parsing form data', 400));
    }
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
      expiresIn: '1h',
    });

    res.json({
      status: true,
      message: "Login Successfully!",
      token,
    });
  });
});

exports.signup = catchAsync(async (req, res) => {
  upload.none()(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        status: false,
        message: 'Error parsing form data',
      });
    }

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
});