const catchAsync = require("../utils/catchAsync");
const Inquiry = require("../db/Inquiry");

exports.InquiryAdd = catchAsync(async (req, res, next) => {
    try {
        const { name, email, contact, message } = req.body;
        if (!email || !name || !contact || !message) {
            return res.status(400).json({
                status: false,
                message: "All fields are required!",
            });
        }
        const lastEnquiry = await Inquiry.findOne().sort({ srNo: -1 });
        const srNo = lastEnquiry ? lastEnquiry.srNo + 1 : 1;
        const newenquiry = new Inquiry({
            srNo,
            email,
            name,
            contact,
            message,
        });
        await newenquiry.save();
        res.status(201).json({
            status: "success",
            message: "Enquiry Added Successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});


exports.InquiryGet = catchAsync(async (req, res, next) => {
    try {
        const enquiries = await Inquiry.find();
        if (!enquiries.length) {
            return res.status(404).json({
                status: false,
                message: "No enquiries found.",
            });
        }

        res.status(200).json({
            status: true,
            message: "Enquiries retrieved successfully!",
            enquiries: enquiries,
        });
    } catch (err) {
        console.error("Error fetching enquiries:", err); 
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});

exports.InquiryDelete = catchAsync(async (req, res, next) => {
    try {
        console.log("req.body", req.body);
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Enquiry is required",
            });
        }
        const deletedEnquiry = await Inquiry.findOneAndDelete({ _id :id });
        if (!deletedEnquiry) {
            return res.status(404).json({
                status: false,
                message: `No data found with Enquiry: ${Inquiry}`,
            });
        }
        return res.status(200).json({
            status: true,
            message: `Enquiry deleted successfully`,
            deletedEnquiry: deletedEnquiry,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});