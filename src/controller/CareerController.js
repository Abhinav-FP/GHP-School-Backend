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
    const {
      name,
      surname,
      email,
      contactNo,
      position,
      experience,
      resume,
      about,
    } = req.body;
    if (
      !name ||
      !surname ||
      !email ||
      !contactNo ||
      !position ||
      !experience ||
      !resume ||
      !about
    ) {
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
      about,
    });
    await newApplication.save();
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address with name
      to: "a.mathur@futureprofilez.com", // recipient address
      subject: `New application received for${position}`, // Subject line
      html: `
     <html>
<head>
    <title>Email template</title>
</head>
<body>
    <table cellspacing="0" cellpadding="0" style="width: 100%;max-width: 400px;margin: 0 auto;font-family: Arial; ">
        <tr>
            <td style="text-align: center;background:#ECE1C5;padding: 10px 10px;">
                <a href="#">
                    <img style="max-width:100%;" 
                    src="https://i.imgur.com/eGTKYS0.png" 
                    alt="img">
                </a>
            </td>
        </tr>
        <tr>
            <td style="padding: 2.2rem 1.2rem; ">
                <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Dear Admin,</p>
                <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">We have received a new application for the post of ${position}. Please find the details attached below.</p>
                <tr>
                    <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                        <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Name</span><b style="font-weight:normal;margin:0">${name}</b></p>
                        <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Surname</span>${surname}</p>
                        <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Email</span> ${email}</p>
                        <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Contact No</span> ${contactNo}</p>
                        <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Position</span> ${position}</p>
                        <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Experience</span>${experience}</p>
                        <p style="font-size:14px;margin:0 0 6px 0;">
  <span style="font-weight:bold;display:inline-block;min-width:146px">Resume</span><a href="${resume}">Download</a></p>
                        <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">About</span>${about}</p>
                    </td>
                </tr>
                <tr>
                    <td style="height:35px;"></td>
                </tr>
            </td>
        </tr>
        <tr>
            <td style="background: #ECE1C5;text-align: center;padding:1.2rem;">
                <a href="#" style="text-decoration: none;margin: 0 7px">
                    <img 
                    src="https://i.imgur.com/APve8Bm.png" alt="img">
                </a>
                <a href="#" style="text-decoration: none;margin: 0 7px">
                    <img 
                    src="https://i.imgur.com/nfe0bz4.png" alt="img">
                </a>
                <a href="#" style="text-decoration: none;margin: 0 7px">
                    <img src="https://i.imgur.com/RFMWfpp.png" alt="img">
                </a>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
    };

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
      message: "Applications retrieved successfully!",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});
