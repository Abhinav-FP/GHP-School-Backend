const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Banner = require("../db/Banner");
const fs = require("fs");
const path = require("path"); // Make sure to import the path module

exports.bannerAdd = catchAsync(async (req, res, next) => {
  try {
    const { heading, text } = req.body;
    const photo = req.file.filename;
    if (!heading || !text || !photo) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const lastBanner = await Banner.findOne().sort({ srNo: -1 });
    const srNo = lastBanner ? lastBanner.srNo + 1 : 1;
    const newBanner = new Banner({
      srNo,
      heading,
      text,
      photo,
    });
    await newBanner.save();
    res.status(201).json({
      status: "success",
      message: "Banner Added Successfully!",
      data: {
        Banner: newBanner,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.bannerGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Banner.find().sort({ srNo: 1 });

    const updatedData = data.map((item) => {
      const imageUrl = `${req.protocol}://${req.get("host")}/images/${
        item.photo
      }`;
      const plainObject = item.toObject(); // Convert to plain object
      return {
        ...plainObject,
        photo: imageUrl,
      };
    });

    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      banners: updatedData,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.bannerDelete = catchAsync(async (req, res, next) => {
  try {
    const { srNo } = req.body;

    // Validate the input
    if (!srNo) {
      return res.status(400).json({
        status: false,
        message: "Banner number (srNo) is required",
      });
    }

    // Find and delete the banner
    const deletedBanner = await Banner.findOneAndDelete({ srNo });
    if (!deletedBanner) {
      return res.status(404).json({
        status: false,
        message: `No banner found with srNo: ${srNo}`,
      });
    }

    // Adjust the `srNo` for the other banners
    const BannersToUpdate = await Banner.find({ srNo: { $gt: srNo } });
    if (BannersToUpdate.length > 0) {
      await Banner.updateMany({ srNo: { $gt: srNo } }, { $inc: { srNo: -1 } });
    }

    // Check and delete the associated photo file if it exists
    if (deletedBanner.photo) {
      const oldPhotoPath = path.join(
        __dirname,
        "../images",
        deletedBanner.photo
      );

      // Ensure the file exists before deleting
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath); // Delete the old image file
      } else {
        console.log("File does not exist, skipping deletion");
      }
    }

    // Respond with success
    return res.status(200).json({
      status: true,
      message: `Banner deleted successfully`,
      deletedBanner: deletedBanner,
    });
  } catch (error) {
    console.error("Error:", error); // Log the error to see details
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});
