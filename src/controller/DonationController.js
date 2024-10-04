const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Donation = require("../db/Donation");
const fs = require("fs");
const path = require("path"); // Make sure to import the path module

exports.donationAdd = catchAsync(async (req, res, next) => {
  try {
    const { amount, name, description } = req.body;
    const photo = req.file.filename;
    if (!amount || !name || !description || !photo) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const lastDonation = await Donation.findOne().sort({ srNo: -1 });
    const srNo = lastDonation ? lastDonation.srNo + 1 : 1;
    const newDonation = new Donation({
      srNo,
      amount,
      name,
      description,
      photo,
    });
    await newDonation.save();
    res.status(201).json({
      status: "success",
      message: "Donation Added Successfully!",
      data: {
        Banner: newDonation,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.donationGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Donation.find().sort({ srNo: 1 });

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
      banners: updatedData,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});
