const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Gallery = require("../db/Gallery");
const fs = require("fs");
const path = require("path"); // Make sure to import the path module

exports.galleryAdd = catchAsync(async (req, res, next) => {
    try {
        const {heading}=req.body;
      const imagePaths = req.files.map(file => file.filename);
      const imgsrc=JSON.stringify(imagePaths);
      const newGallery = new Gallery({
        heading: heading,
        images: imgsrc 
      });
      await newGallery.save();
      res.status(201).json({
        status: true,
        message: "Gallery images added successfully!",
        data: newGallery
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later."
      });
    }
});

exports.galleryGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Gallery.find({});
    console.log("data",data);
    const parsedData = data.map(item => ({
      ...item._doc, // Spread the existing document fields
      images: JSON.parse(item.images).map(image => 
        `${req.protocol}://${req.get("host")}/images/${image}` // Construct URL for each image
      )
    }));
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      data: parsedData,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.galleryGetId = catchAsync(async (req, res, next) => {
  try {
    const { uuid } = req.params || null;
    const data = await Gallery.find({_id:uuid});
    console.log("data",data);
    const parsedData = data.map(item => ({
      ...item._doc, // Spread the existing document fields
      images: JSON.parse(item.images).map(image => 
        `${req.protocol}://${req.get("host")}/images/${image}` // Construct URL for each image
      )
    }));
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      data: parsedData,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});