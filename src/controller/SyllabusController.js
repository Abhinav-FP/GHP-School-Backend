const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Syllabus = require("../db/Syllabus");

exports.bannerAdd = catchAsync(async (req, res, next) => {
  try {
    const { text, link } = req.body;
    if (!link || !text) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const lastData = await Syllabus.findOne().sort({ srNo: -1 });
    const srNo = lastData ? lastData.srNo + 1 : 1;
    const newData = new Syllabus({
      srNo,
      text,
      link,
    });
    await newData.save();
    res.status(201).json({
      status: "success",
      message: "Syllabus Added Successfully!",
      data: {
        Syllabus: newData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});