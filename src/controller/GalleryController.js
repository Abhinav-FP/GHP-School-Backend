const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Gallery = require("../db/Gallery");
const fs = require("fs");
const path = require("path"); // Make sure to import the path module

exports.galleryAdd = catchAsync(async (req, res, next) => {
    try {
        const {heading}=req.body;
      const imagePaths = req.files.map(file => file.filename);

      const newGallery = new Gallery({
        heading: heading,
        images: imagePaths 
      });
  
      // Save the new document to MongoDB
      await newGallery.save();
  
      // Logic to store data in the database can go here
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