const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Gallery = require("../db/Gallery");
const fs = require("fs");
const path = require("path"); // Make sure to import the path module
const sharp = require("sharp")

// async function SizeReducer(inputFilePath, outputFilePath) {
//   try {
//     let image = sharp(inputFilePath);
//     let metadata = await image.metadata();
//     let { width, height } = metadata;

//     let resizedImage = image;
//     let fileSize = (await image.toBuffer()).length;
//     const MAX_SIZE = 2048;
//     while (fileSize > MAX_SIZE) {
//       width = Math.floor(width * 0.9);
//       height = Math.floor(height * 0.9);
//       resizedImage = image.resize({ width, height });
//       fileSize = (await resizedImage.toBuffer()).length;
//       console.log(`Resizing to ${width}x${height}, new size: ${fileSize} bytes`);
//     }
//     return await resizedImage.toFile(outputFilePath);
//   } catch (err) {
//     console.error('Error resizing image:', err);
//   }
// }


exports.galleryAdd = catchAsync(async (req, res, next) => {
    try {
      const { heading }=req.body;
      const files = req.files;
      console.log("files",files)
      const uploadFile = async (g) => { 
        const name = g.filename.replaceAll(" ", '-')
        const newGallery = new Gallery({
          caption: req.body.heading.replaceAll(" ", '-'),
          fileSize: g.size, 
          name: name,
          url :  `${name}`,
        });
        await newGallery.save();
      }
      files.forEach((g, i)=>{
        uploadFile(g)
      });

      res.status(201).json({
        status: true,
        message: "Gallery images added successfully!",
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
