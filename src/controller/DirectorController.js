const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Management = require("../db/Management");
const fs=require("fs");

exports.directorAdd = catchAsync(async (req, res, next) => {
  try {
    const { name, text } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!name || !text) {
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

    const updatedData = data.map((item) => {
      const imageUrl = `${req.protocol}://${req.get("host")}/images/${
        item.photo
      }`;
      const plainObject = item.toObject(); // Convert to plain object
      return {
        ...plainObject,
        photo: imageUrl,
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

exports.directorEdit = catchAsync(async (req, res, next) => {
  try {
    const { name, text, id } = req.body;
    const photo = req.file ? req.file.filename : null; 
    const data = await Management.findOne({ _id: id });
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "No user found.",
      });
    }
    data.name = name;
    data.text = text;
    if (photo) {
      if (data.photo) {
        const oldPhotoPath = path.join(__dirname, '../images', data.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);  // Delete the old image file
        }
      }
      data.photo = photo;
    }
    await data.save();
    res.status(200).json({
      status: 'success',
      message: 'Data updated successfully!',
      data: {
        principal: data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});