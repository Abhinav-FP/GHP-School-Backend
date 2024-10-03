const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Management = require("../db/Management");
const fs = require('fs');
const path = require('path');

exports.principalAdd = catchAsync(async (req, res, next) => {
  try {
    const { name, text } = req.body;
    const photo = req.file.filename;

    if (!name || !text || !photo) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }

    const lastdata = await Management.findOne().sort({ srNo: -1 });
    const srNo = lastdata ? lastdata.srNo + 1 : 1;

    const newdata = new Management({
      srNo,
      type: "principal",
      name,
      photo,
      text,
    });

    await newdata.save();
    res.status(201).json({
      status: "success",
      message: "Principal Added Successfully!",
      data: {
        principal: newdata,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.principalGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Management.findOne({ type: "principal" });
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      data.photo
    }`;
    data.photo = imageUrl;
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      principal: data,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.principalEdit = catchAsync(async (req, res, next) => {
  try {
    const { name, text } = req.body;
    const photo = req.file ? req.file.filename : null; 
    const data = await Management.findOne({ type: "principal" });
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "No user found.",
      });
    }
    data.name = name;
    data.text = text;
    if (photo) {
      if (data.photo) {
        const oldPhotoPath = path.join(__dirname, '../images', data.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);  // Delete the old image file
        }
      }
      data.photo = photo;
    }
    await data.save();
    res.status(200).json({
      status: 'success',
      message: 'Data updated successfully!',
      data: {
        principal: data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});


exports.imageTest = catchAsync(async (req, res, next) => {
  console.log("Hello");
  try {
    const image = req.file ? req.file.filename : null;
    const data = `http://localhost:8000/files/${image}`;
    res.status(200).json({
      status: 'success',
      message: 'Image saved successfully!',
      data: {
        url: data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
})