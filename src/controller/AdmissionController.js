const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Admission = require("../db/Admission");

exports.AdmissionLineAdd = catchAsync(async (req, res, next) => {
  try {
    const { show, text } = req.body;
    if (!show || !text) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const newAdmission = new Admission({
      show,
      text,
    });
    await newAdmission.save();
    res.status(201).json({
      status: "success",
      message: "Data Added Successfully!",
      data: {
        Data: newAdmission,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.AdmissionLineShow = catchAsync(async (req, res, next) => {
  try {
    const { show } = req.body;
    if (typeof show !== "boolean") {
      return res.status(400).json({
        status: false,
        message: "Please send a valid boolean value for 'show'!",
      });
    }
    const updatedAdmission = await Admission.findOneAndUpdate(
      {},
      { show },
      { new: true }
    );
    if (!updatedAdmission) {
      return res.status(404).json({
        status: false,
        message: "Admission entry not found!",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Value updated successfully!",
      data: updatedAdmission,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.AdmissionLineText = catchAsync(async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        status: false,
        message: "Text can't be empty!",
      });
    }
    const updatedAdmission = await Admission.findOneAndUpdate(
      {},
      { text },
      { new: true }
    );
    if (!updatedAdmission) {
      return res.status(404).json({
        status: false,
        message: "Admission entry not found!",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Value updated successfully!",
      data: updatedAdmission,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.AdmissionGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Admission.findOne({});
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
});
