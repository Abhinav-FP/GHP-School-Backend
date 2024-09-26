const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Management = require("../db/Management");

exports.directorAdd = catchAsync(async (req, res, next) => {
    try {
      const { name, text } = req.body; 
      const photo = req.file.filename; 
  
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
      
      const updatedData = data.map(item => {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${item.photo}`; 
        const plainObject = item.toObject(); // Convert to plain object
        return {
            ...plainObject,
            photo: imageUrl
        };
    });
  
      res.status(200).json({
        status: true,
        message: "Data retrieved successfully!",
        director: updatedData,
      });
    } catch (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later.",
      });
    }
  });
  