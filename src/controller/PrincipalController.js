const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Management = require("../db/Management");

exports.principalAdd = catchAsync(async (req, res, next) => {
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
        type: "principal",
        name,
        photo,
        text,
      });
  
      await newdata.save();
      res.status(201).json({
        status: "success",
        message: "Principal Added Successfully!",
        data: {
          principal: newdata,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later.",
      });
    }
  });

exports.principalGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Management.findOne({ type: "principal" });
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${data.photo}`;
    data.photo=imageUrl;
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      principal: data,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});