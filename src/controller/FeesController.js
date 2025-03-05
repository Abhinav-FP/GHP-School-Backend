const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Fees = require("../db/Fees");


exports.feesAdd = catchAsync(async (req, res, next) => {
  try {
    console.log("req.body", req?.body);
    const { grade, first, second, third, fourth, total } = req.body;
    if (!grade || !first || !second || !third || !fourth || !total) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const last = await Fees.findOne().sort({ srNo: -1 });
    const srNo = last ? last.srNo + 1 : 1;
    const newData = new Fees({
      srNo,
      grade,
      first,
      second,
      third,
      fourth,
      total,
    });
    await newData.save();
    res.status(201).json({
      status: "success",
      message: "Fees Added Successfully!",
      data: {
        faculty: newData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.feesGet = catchAsync(async (req, res, next) => {
  try {
    const fees = await Fees.find().sort({ srNo: 1 });
    if (!fees || fees.length === 0) {
      return res.status(204).json({
        status: false,
        message: "No tasks found for this user.",
        fees: [],
      });
    }
    res.status(200).json({
      status: true,
      message: "Tasks retrieved successfully!",
      fees: fees,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.feesDelete = catchAsync(async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { grade } = req.body;
    if (!grade) {
      return res.status(400).json({
        status: false,
        message: "Grade is required",
      });
    }
    const deletedGrade = await Fees.findOneAndDelete({ grade });
    if (!deletedGrade) {
      return res.status(404).json({
        status: false,
        message: `No data found with grade: ${grade}`,
      });
    }
    const facultiesToUpdate = await Fees.find({
      srNo: { $gt: deletedGrade.srNo },
    });
    if (facultiesToUpdate.length > 0) {
      await Faculty.updateMany(
        { srNo: { $gt: deletedGrade.srNo } },
        { $inc: { srNo: -1 } }
      );
    }
    return res.status(200).json({
      status: true,
      message: `Fees deleted successfully`,
      deletedGrade: deletedGrade,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.feesEdit = catchAsync(async (req, res, next) => {
  try {
    const { id, grade, first, second, third, fourth, total } = req.body;

    // Check if all required fields are provided
    if (!id ||
      !grade ||
      first === undefined ||
      second === undefined ||
      third === undefined ||
      fourth === undefined ||
      total === undefined
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const result = await Fees.findByIdAndUpdate(
      id, // Find by ID
      {
          $set: { grade, first, second, third, fourth, total }, // Fields to update
      },
      { new: true } // Return the updated document
  );
    if (result.nModified === 0) {
      return res.status(404).json({
        status: false,
        message: "No records found for the specified grade!",
      });
    }
    res.status(200).json({
      status: true,
      message: "Fees updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});