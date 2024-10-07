const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { v4: uuidv4 } = require("uuid");
const Vacancy = require("../db/Vacancy");
const Application = require("../db/CareerApplication");
// Email logic
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // Gmail SMTP server
  port: process.env.MAIL_PORT, // Port for SSL
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.MAIL_USERNAME, // Your Gmail address
    pass: process.env.MAIL_PASSWORD, // Your app password
  },
});

const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.messageId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Mail error:", error);
    return false;
  }
};

const mailOptions = {
  from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address with name
  to: "a.mathur@futureprofilez.com", // recipient address
  subject: "New data has arrived on AITA", // Subject line
  html: `
  <html>
    <body style="text-align: center; margin: 0; padding: 10px; background-color: #000000; color: #ffffff;" align="center">
      Checking email
    </body>
  </html>
  `,
};

exports.VacancyAdd = catchAsync(async (req, res, next) => {
  try {
    const { designation, description, experience, qualification } = req.body;
    if (!designation || !description || !experience || !qualification) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const UUID = uuidv4();
    const newVacancy = new Vacancy({
      uuid: UUID,
      designation,
      description,
      experience,
      qualification,
    });
    await newVacancy.save();
    res.status(201).json({
      status: "success",
      message: "Vacancy Created Successfully!",
      data: {
        Vacancy: newVacancy,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.VacancyDelete = catchAsync(async (req, res, next) => {
  try {
    const { uuid } = req.body;
    if (!uuid) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const deletedVacancy = await Vacancy.findOneAndDelete({ uuid: uuid });
    if (!deletedVacancy) {
      return res.status(404).json({
        status: false,
        message: `No faculty found with given uuid: ${uuid}`,
      });
    }
    return res.status(200).json({
      status: true,
      message: `Vacancy deleted successfully`,
      deletedVacancy: deletedVacancy,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.VacancyGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Vacancy.find();
    if (!data || data.length === 0) {
      return res.status(204).json({
        status: false,
        message: "No data found",
        data: [],
      });
    }
    res.status(200).json({
      status: true,
      message: "Vacancies retrieved successfully!",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.CareerApply = catchAsync(async (req, res, next) => {
  try {
    const { name, surname, email, contactNo, position, experience, resume, about } = req.body;
    if (!name || !surname || !email || !contactNo || !position || !experience || !resume || !about) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const UUID = uuidv4();
    const newApplication = new Application({
      uuid: UUID,
      name, 
      surname, 
      email, 
      contactNo, 
      position, 
      experience, 
      resume, 
      about
    });
    await newApplication.save();
    try {
      const sendMailResponse = await sendMail(mailOptions);
      if (!sendMailResponse) {
        throw new Error("Failed to send email");
      }
      console.log("Email sent successfully");
    } catch (error) {
      console.log("Error in sending email:", error);
    }
    res.status(201).json({
      status: "success",
      message: "Application submitted successfully!",
      data: {
        applicaton: newApplication,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.CareerGet = catchAsync(async (req, res, next) => {
  try {
    const data = await Application.find();
    if (!data || data.length === 0) {
      return res.status(204).json({
        status: false,
        message: "No data found",
        data: [],
      });
    }
    res.status(200).json({
      status: true,
      message:"Applications retrieved successfully!",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});