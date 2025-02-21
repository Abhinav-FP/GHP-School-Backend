const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Notification = require("../db/Notification");
const Academy = require("../db/Academy");

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

exports.NotificationAdd = catchAsync(async (req, res, next) => {
    try {
        const { text, link, content } = req.body;
        if (!link || !text) {
            return res.status(400).json({
                status: false,
                message: "All fields are required!",
            });
        }
        const lastData = await Notification.findOne().sort({ srNo: -1 });
        const url = convertToDownloadLink(link);
        const srNo = lastData ? lastData.srNo + 1 : 1;
        const newData = new Notification({
            srNo,
            text,
            content,
            link: url,
            viewLink: link
        });
        await newData.save();
        res.status(201).json({
            status: "success",
            message: "Notification Added Successfully!",
            data: {
                Notification: newData,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});

exports.NotificationGet = catchAsync(async (req, res, next) => {
    try {
        const data = await Notification.find().sort({ srNo: 1 });
        res.status(200).json({
            status: true,
            message: "Data retrieved successfully!",
            Notification: data,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});

exports.NotificationDelete = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Result id is required",
            });
        }
        const deletedBanner = await Notification.findOneAndDelete({ _id: id });
        if (!deletedBanner) {
            return res.status(404).json({
                status: false,
                message: `No result found with given id`,
            });
        }
        const BannersToUpdate = await Notification.find({ srNo: { $gt: deletedBanner.srNo } });
        if (BannersToUpdate.length > 0) {
            await Notification.updateMany({ srNo: { $gt: srNo } }, { $inc: { srNo: -1 } });
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

exports.NotificationUpdate = catchAsync(async (req, res, next) => {
    try {
        const { _id, text, link, content } = req.body;
        if (!_id || !text || !link) {
            return res.status(400).json({
                status: false,
                message: "All fields are required!",
            });
        }
        const url = convertToDownloadLink(link);
        const updatedData = await Notification.findByIdAndUpdate(
            _id,
            { text, link: url, viewLink: link, content },
            { new: true, runValidators: true }
        );
        if (!updatedData) {
            return res.status(404).json({
                status: false,
                message: "Notification entry not found!",
            });
        }
        res.status(200).json({
            status: true,
            message: "Notification updated successfully!",
            data: updatedData,
        });
    } catch (error) {
        console.error("Error:", error); // Log the error to see details
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });

    }

});


exports.CalendarAdd = catchAsync(async (req, res, next) => {
    try {
        const { text, link, content } = req.body;
        if (!link ) {
            return res.status(400).json({
                status: false,
                message: "All fields are required!",
            });
        }
        const lastData = await Academy.findOne().sort({ srNo: -1 });
        const url = convertToDownloadLink(link);
        const newData = new Academy({
            link: url,
            viewLink: link
        });
        await newData.save();
        res.status(201).json({
            status: "success",
            message: "Calendar Added Successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});

exports.CalendarGet = catchAsync(async (req, res, next) => {
    try {
        const data = await Academy.findOne();
        res.status(200).json({
            status: true,
            message: "Data retrieved successfully!",
            academics: data,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});


exports.CalendarUpdate = catchAsync(async (req, res, next) => {
    try {
        const { _id, link } = req.body;
        if (!_id || !link) {
            return res.status(400).json({
                status: false,
                message: "All fields are required!",
            });
        }
        const url = convertToDownloadLink(link);
        const updatedData = await Academy.findByIdAndUpdate(
            _id,
            { link: url, viewLink: link },
            { new: true, runValidators: true }
        );
        if (!updatedData) {
            return res.status(404).json({
                status: false,
                message: "Calendar entry not found!",
            });
        }
        res.status(200).json({
            status: true,
            message: "Calendar updated successfully!",
            data: updatedData,
        });
    } catch (error) {
        console.error("Error:", error); // Log the error to see details
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });

    }

});