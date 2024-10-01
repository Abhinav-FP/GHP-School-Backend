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
    const filteredData = Object.values(data.reduce((acc, item) => {
      if (!acc[item.caption]) {
        acc[item.caption] = item;
      }
      return acc;
    }, {}));
    console.log("filteredData",filteredData);
    const updatedData = filteredData.map((item) => {
      const Url = `${req.protocol}://${req.get("host")}/images/gallery/${
        item.url
      }`;
      const plainObject = item.toObject(); // Convert to plain object
      return {
        ...plainObject,
        url: Url,
      };
    });
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      data: updatedData,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.galleryGetCategory = catchAsync(async (req, res, next) => {
  try {
    const { type } = req.params;
    const data = await Gallery.find({caption:type});
    const updatedData = data.map((item) => {
      const Url = `${req.protocol}://${req.get("host")}/images/gallery/${
        item.url
      }`;
      const plainObject = item.toObject(); // Convert to plain object
      return {
        ...plainObject,
        url: Url,
      };
    });
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      data: updatedData,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.galleryDeleteById = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Id is required",
      });
    }

    const deletedResult = await Gallery.findOneAndDelete({ _id: id });
    if (!deletedResult) {
      return res.status(404).json({
        status: false,
        message: `No gallery found with id: ${id}`,
      });
    }

    if (deletedResult.url) {
      const oldPhotoPath = path.join(__dirname, '../images/gallery', deletedResult.url);
      if (fs.existsSync(oldPhotoPath)) {
        try {
          fs.unlinkSync(oldPhotoPath);  
        } catch (unlinkError) {
          console.error("Error deleting file:", unlinkError);
          return res.status(500).json({
            status: false,
            message: "Error deleting the image file from the server",
          });
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: `Gallery entry and image deleted successfully`,
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