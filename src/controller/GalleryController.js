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

exports.galleryDelete = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Id is required",
      });
    }

    // Find and delete the gallery by id
    const deletedResult = await Gallery.findOneAndDelete({ _id: id });
    if (!deletedResult) {
      return res.status(404).json({
        status: false,
        message: `No gallery found with id: ${id}`,
      });
    }
    
    console.log("deletedResult", deletedResult);

    // Parse the images array from the stringified JSON
    const imagesArray = JSON.parse(deletedResult.images); // No need for a map here as we're parsing the string directly

    if (imagesArray) {
      imagesArray.forEach(image => {
        const oldPhotoPath = path.join(__dirname, "../images", image); // Update the path for each image
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath); // Delete the file
          console.log(`Deleted image: ${oldPhotoPath}`); // Optional log for success
        } else {
          console.log(`File does not exist: ${oldPhotoPath}, skipping deletion`); // Log if the file doesn't exist
        }
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
