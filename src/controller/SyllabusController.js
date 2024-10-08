const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Syllabus = require("../db/Syllabus");

const convertToDownloadLink = (url) => {
  const fileIdPattern = /\/d\/(.*?)\//; // Regex to extract the file ID
  const match = url.match(fileIdPattern);

  if (match && match[1]) {
    const fileId = match[1]; // Extracted file ID
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  } else {
    return url; // Return the original URL if no match is found
  }
};

exports.syllabusAdd = catchAsync(async (req, res, next) => {
  try {
    const { text, link } = req.body;
    if (!link || !text) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const lastData = await Syllabus.findOne().sort({ srNo: -1 });
    const url = convertToDownloadLink(link);
    const srNo = lastData ? lastData.srNo + 1 : 1;
    const newData = new Syllabus({
      srNo,
      text,
      link: url,
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

exports.syllabusGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Syllabus.find().sort({ srNo: 1 });
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      syllabus: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.syllabusDelete = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!srNo) {
      return res.status(400).json({
        status: false,
        message: "Result id is required",
      });
    }
    const deletedBanner = await Syllabus.findOneAndDelete({ _id:id });
    if (!deletedBanner) {
      return res.status(404).json({
        status: false,
        message: `No result found with given id`,
      });
    }
    const BannersToUpdate = await Banner.find({ srNo: { $gt: deletedBanner.srNo } });
    if (BannersToUpdate.length > 0) {
      await Syllabus.updateMany({ srNo: { $gt: srNo } }, { $inc: { srNo: -1 } });
    }
    return res.status(200).json({
      status: true,
      message: `Result deleted successfully`,
      deletedData: deletedBanner,
    });
  } catch (error) {
    console.error("Error:", error); // Log the error to see details
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});
