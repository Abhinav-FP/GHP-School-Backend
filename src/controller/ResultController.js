const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Result = require("../db/Result");
const fs = require("fs");
const path = require("path");
const { imageTest } = require("./PrincipalController");
const { default: axios } = require("axios");

exports.resultAdd = catchAsync(async (req, res, next) => {
  try {
    const { rollNo, name, grade, percentage, stream, hash, photo } = req.body;
    if (!photo) {
      return res.status(400).json({
        status: false,
        message: "Image is required!",
      });
    }
    if (!rollNo || !name || !photo || !grade || !percentage) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    if (grade == "XII" && !stream) {
      return res.status(400).json({
        status: false,
        message: "Stream is required for XII grade!",
      });
    }
    const data = new Result({
      rollNo,
      name,
      grade,
      stream,
      photo,
      percentage,
      imagehash:hash,
    });
    await data.save();
    res.status(201).json({
      status: "success",
      message: "Data Added Successfully!",
      data: {
        Result: data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.resultGet = catchAsync(async (req, res, next) => {
  try {
    
    const data = await Result.find({ }).sort({ percentage: -1 });
    if(data.length==0){
        res.status(200).json({
            status: false,
            message: "No data found!",
          });
    }
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      data: data,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.resultDelete = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Result id is required",
      });
    }
    const deletedResult = await Result.findOneAndDelete({ _id: id });
    if (!deletedResult) {
      return res.status(404).json({
        status: false,
        message: `No result found`,
      });
    }
    return res.status(200).json({
      status: true,
      message: `Result deleted successfully`,
      deletedResult: deletedResult,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});
