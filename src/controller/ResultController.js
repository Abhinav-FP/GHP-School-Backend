const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Result = require("../db/Result");
const fs = require("fs");
const path = require("path");

exports.resultAdd = catchAsync(async (req, res, next) => {
  try {
    const { rollNo, name, grade, percentage, stream } = req.body;
    const photo = req.file ? req.file.filename : null;
    if (photo == null) {
      return res.status(400).json({
        status: false,
        message: "Image is required!",
      });
    }
    if (!rollNo || !name || !photo || !grade || !percentage) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    if (grade == "XII" && !stream) {
      return res.status(400).json({
        status: false,
        message: "Stream is required for XII grade!",
      });
    }
    const data = new Result({
      rollNo,
      name,
      grade,
      stream,
      photo,
      percentage,
    });
    await data.save();
    res.status(201).json({
      status: "success",
      message: "Data Added Successfully!",
      data: {
        Result: data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.resultGet = catchAsync(async (req, res, next) => {
  try {
    const { grade } = req.params;
    const data = await Result.find({ grade: grade }).sort({ percentage: -1 });
    if(data.length==0){
        res.status(200).json({
            status: false,
            message: "No data found!",
          });
    }
    const updatedData = data.map((item) => {
      const imageUrl = `${process.env.DOMAIN}/tmp/${
        item.photo
      }`;
      const plainObject = item.toObject();
      return {
        ...plainObject,
        photo: imageUrl,
      };
    });

    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      data: updatedData,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.resultDelete = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Result id is required",
      });
    }
    const deletedResult = await Result.findOneAndDelete({ _id: id });
    if (!deletedResult) {
      return res.status(404).json({
        status: false,
        message: `No banner found with srNo: ${srNo}`,
      });
    }
    if (deletedResult.photo) {
      const oldPhotoPath = path.join(
        __dirname,
        "../images",
        deletedResult.photo
      );
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      } else {
        console.log("File does not exist, skipping deletion");
      }
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
