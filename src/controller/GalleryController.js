const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Gallery = require("../db/Gallery");
const Sport = require("../db/Sport");
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
      console.log("req.body", req.body)
      const { caption, url, name, size, title, description  }= req.body;
      if(!name || !title || !size || !description || !caption || !url){
        return res.status(400).json({
          status: false,
          message: "All fields are required!",
        });
      }
      const newGallery = new Gallery({
        caption: caption,
        title: title, 
        description: description,
        fileSize: size,
        name: name,  
        url : url,
      });
      await newGallery.save();
      res.status(201).json({
        status: true,
        item: newGallery,
        message: "Gallery images added successfully!",
      });
    } catch (error) {
      console.log("error",error)
      res.status(500).json({
        status: false,
        error : error,
        message: "An unknown error occurred. Please try again later."
      });
    }
});

exports.admingallery = catchAsync(async (req, res, next) => {
  try {
    console.log("Hello");
    const data = await Gallery.find({});
    if(data== null || !data){
      res.status(200).json({
        status: true,
        message: "No data available",
        data: [],
      });
    }
    const groupedData = data.reduce((acc, item) => {
        // Check if the group for the current caption already exists
        const group = acc.find(g => g.title.toLowerCase() === item.caption.toLowerCase());
    
        // If it exists, push the current item into the 'images' array
        if (group) {
            group.images.push({
                _id: item._id,
                name: item.name,
                url: item.url,
                fileSize: item.fileSize,
                createdAt: item.createdAt
            });
        } else {
            // If the group doesn't exist, create a new one
            acc.push({
                title: item.caption,
                images: [{
                    _id: item._id,
                    name: item.name,
                    url: item.url,
                    fileSize: item.fileSize,
                    createdAt: item.createdAt
                }]
            });
        }
    
        return acc;
    }, []);
  
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      data: groupedData,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
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

exports.sportsAdd = catchAsync(async (req, res, next) => {
  try {
    const { image, imagehash }=req.body;
    
    if (!image || !imagehash) {
      return res.status(400).json({
        status: false,
        message: "Image and its hash both are required!",
      });
    }
    const newData = new Sport({
      image,
      imagehash,
    });
    await newData.save();
    res.status(201).json({
      status: "success",
      message: "Image Added Successfully!",
      data: {
        Sport: newData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.sportsGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Sport.find({});
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      sport: data,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
})

exports.sportsDelete = catchAsync(async (req, res, next) => {
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
    const deletedBanner = await Sport.findOneAndDelete({ _id:id });
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