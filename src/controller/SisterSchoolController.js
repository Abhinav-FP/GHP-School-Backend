const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const SisterSchool = require("../db/SisterSchool");

exports.schoolAdd = catchAsync(async (req, res, next) => {
    try {
      const { image, imagehash, link }=req.body;
      
      if (!image || !imagehash || !link){
        return res.status(400).json({
          status: false,
          message: "Image and its hash both are required!",
        });
      }
      const newData = new SisterSchool({
        image,
        imagehash,
        link,
      });
      await newData.save();
      res.status(201).json({
        status: "success",
        message: "Image Added Successfully!",
        data: {
          school: newData,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later.",
      });
    }
  });
  
  exports.schoolGet = catchAsync(async (req, res, next) => {
    try {
      const data = await SisterSchool.find({});
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
  })
  
  exports.schoolDelete = catchAsync(async (req, res, next) => {
    try {
      const { id } = req.body;
      // Validate the input
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Image id is required",
        });
      }
      
      // Find and delete the banner
      const deletedBanner = await SisterSchool.findOneAndDelete({ _id:id });
      if (!deletedBanner) {
        return res.status(404).json({
          status: false,
          message: `No image found with given id`,
        });
      }
      // Respond with success
      return res.status(200).json({
        status: true,
        message: `Image deleted successfully`,
        deletedImage: deletedBanner,
      });
    } catch (error) {
      console.error("Error:", error); // Log the error to see details
      return res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later.",
      });
    }
  });