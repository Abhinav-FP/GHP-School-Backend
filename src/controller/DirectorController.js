const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Management = require("../db/Management");
const fs=require("fs");

exports.directorAdd = catchAsync(async (req, res, next) => {
  try {
    const { name, text, photo, hash } = req.body;
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
      type: "director",
      name,
      photo,
      imagehash:hash,
      text,
    });

    await newdata.save();
    res.status(201).json({
      status: "success",
      message: "Director Added Successfully!",
      data: {
        director: newdata,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.directorGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Management.find({ type: "director" }).sort({ srNo: 1 });
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      director: data,
    });
  } catch (err) {
    console.error(err); 
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.directorEdit = catchAsync(async (req, res, next) => {
  try {
    const {  name, text, id, photo, hash  } = req.body;
    const data = await Management.findOne({ _id: id });
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "No user found.",
      });
    }
    data.name = name;
    data.text = text;
    if(photo){
      data.photo = photo;
    }
    if(hash){
      data.hash = hash;
    }
    await data.save();
    res.status(200).json({
      status: 'success',
      message: 'Data updated successfully!',
      data: {
        director: data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});