const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const ComingSoon = require("../db/ComingSoon");

exports.ComingSoonAdd = catchAsync(async (req, res, next) => {
  try {
    const { image, imagehash, text1, text2, show } = req.body;

    if (!image || !text1 || !text2 || !show) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const newData = new ComingSoon({
      image,
      imagehash,
      text1,
      text2,
      show,
    });
    await newData.save();
    res.status(201).json({
      status: "success",
      message: "Data Added Successfully!",
      data: {
        data: newData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.ComingSoonGet = catchAsync(async (req, res, next) => {
  try {
    const data = await ComingSoon.findOne({});
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

exports.ComingSoonShow = catchAsync(async (req, res, next) => {
  try {
    const { show } = req.body;
    if (typeof show !== "boolean") {
      return res.status(400).json({
        status: false,
        message: "Please send a valid boolean value for 'show'!",
      });
    }
    const updatedAdmission = await ComingSoon.findOneAndUpdate(
      {},
      { show },
      { new: true }
    );
    if (!updatedAdmission) {
      return res.status(404).json({
        status: false,
        message: "Data not found!",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Data Updated successfully!",
      data: updatedAdmission,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.ComingSoonEdit = catchAsync(async (req, res, next) => {
    try {
      const { image, imagehash, text1, text2 } = req.body;
      let updateFields = {};
      if (image !== null && image !== '') {
        updateFields.image = image;
      }
      if (imagehash !== null && imagehash !== '') {
        updateFields.imagehash = imagehash;
      }
      if (text1 !== null && text1 !== '') {
        updateFields.text1 = text1;
      }
      if (text2 !== null && text2 !== '') {
        updateFields.text2 = text2;
      }
      if (Object.keys(updateFields).length > 0) {
        const updatedDocument = await ComingSoon.findOneAndUpdate(
          {},
          { $set: updateFields },
          { new: true }  
        );
  
        return res.status(200).json({
          status: true,
          message: "ComingSoon document updated successfully",
          data: updatedDocument,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "No valid fields provided for update",
        });
      }
  
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later.",
      });
    }
  });
  
