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
      subject: `New application received for ${position}`, // Subject line
      html: `
     <html>
      <head>
          <title>Email template</title>
      </head>
      <body>
          <table cellspacing="0" cellpadding="0" style="width: 100%;max-width: 400px;margin: 0 auto;font-family: Arial; ">
              <tr>
                  <td style="text-align: center;background:#ECE1C5;padding: 10px 10px;">
                      <a href="https://ghp-school.vercel.app/">
                          <img style="max-width:100%;" 
                          src="https://i.imgur.com/eGTKYS0.png" 
                          alt="BVBS School">
                      </a>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 2.2rem 1.2rem 0; ">
                      <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 0.5rem;">Dear Admin,</p>
                      <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">We have received a new application for the post of ${position}. Please find the details attached below.</p>
                      
                  </td>
              </tr>
              <tr>
                          <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;color: #4D4D4D;">
                              <p style="font-size:14px;margin:0 0 9px 0;"><span style="font-weight:bold;display:inline-block;">Name </span> - <b style="font-weight:normal;margin:0">${name}</b></p>
                              <p style="font-size:14px;margin:0 0 9px 0;"><span style="font-weight:bold;display:inline-block;">Surname </span> - ${surname}</p>
                              <p style="font-size:14px;margin:0 0 9px 0;"><span style="font-weight:bold;display:inline-block;">Email </span> - ${email}</p>
                              <p style="font-size:14px;margin:0 0 9px 0;"><span style="font-weight:bold;display:inline-block;">Contact No </span> - ${contactNo}</p>
                              <p style="font-size:14px;margin:0 0 9px 0;"><span style="font-weight:bold;display:inline-block;">Position </span> - ${position}</p>
                              <p style="font-size:14px;margin:0 0 9px 0;"><span style="font-weight:bold;display:inline-block;">Experience (in years) </span> - ${experience}</p>
                              <p style="font-size:14px;margin:0 0 9px 0;"><span style="font-weight:bold;display:inline-block;">Resume </span> - <a href="${resume}">Download</a></p>
                              <p style="font-size:14px;margin:0 0 9px 0;"><span style="font-weight:bold;display:inline-block;">About </span> -  </p>
                              <p style="font-size:14px;margin:0 0 9px 0;">${about}</p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:35px;"></td>
                      </tr>
               
       <tr>
      <td style="text-align: left;padding:1.2rem; background: #ECE1C5;text-align: center;">
         
        <div style="margin: 0 0 10px">
          <a href="https://www.facebook.com/profile.php?id=61557061876412" target="blank" style="color:#4D4D4D; font-size:14px; text-decoration: none;"><img style="margin-right: 5px; vertical-align: top;" src="https://i.imgur.com/BncNmdi.png" alt="img"><span style="opacity: 0.8">Bal Vishwa Bharti</span></a>
        </div>
        <div style="margin: 0 0 10px">
         <a href="https://www.instagram.com/bvbschool?igsh=ZTR5ZWl3bmdjYThv" target="blank" style="color:#4D4D4D; font-size:14px; text-decoration: none;"><img style="margin-right: 5px; vertical-align: middle;" src="https://i.imgur.com/C6UZOQ7.png" alt="img"><span style="opacity: 0.8">@bvbschool</span></a>
        </div>
        <div>
         <a href="https://www.youtube.com/@bvbschool-t9z" target="blank" style="color:#4D4D4D; font-size:14px; text-decoration: none;"><img style="margin-right: 5px; vertical-align: middle;" src="https://i.imgur.com/qalbEh5.png" alt="img"><span style="opacity: 0.8">@bvbschool-t9z</span></a>
        </div>
         
      </td>
    </tr>
      <td style="text-align: left;padding:1.2rem 1.2rem 1rem; border-top:1px solid rgba(0,0,0,.1);background: #ECE1C5; text-align: center;">
         
        <div style="margin: 0 0 10px">
          <img style="margin-right: 3px; vertical-align: top;" src="https://i.imgur.com/3OuZKWO.png" alt="img"> 
          <a href="tel:01412282790"  style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">01412282790</a><span style="opacity: 0.8;color:#4D4D4D;font-size:14px;">/</span>
          <a href="tel:01412282298"  style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">01412282298</a><span style="opacity: 0.8;color:#4D4D4D;font-size:14px;">/</span>
          <a href="tel:+919001869684"  style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">90018-69684</a>
        </div>
        <div style="margin: 0 0 10px">
        <img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/QFBWsuV.png" alt="img"> 
           <a href="mailto:bvbpschool74@gmail.com" style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">bvbpschool74@gmail.com</a><span style="opacity: 0.8;color:#4D4D4D;font-size:14px;">/</span>
          <a href="mailto:bvbschool74@gmail.com" style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">bvbschool74@gmail.com</a>
        </div>
        <div style="line-height: 24px;">
         <a href="https://www.google.com/maps/dir//D,+74,+Ghiya+Marg,+Sindhi+Colony,+Bani+Park,+Jaipur,+Rajasthan+302032+@26.931568,75.791982/@27.7436422,76.5794786,7z/data=!4m7!4m6!1m1!4e2!1m2!1m1!1s0x396db3efafa594ef:0x2da3b3ab79a793f4!3e0" target="blank" style="color:#4D4D4D; font-size:14px; text-decoration: none;"><img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/x4NTArq.png" alt="img"> <span style="opacity: 0.8">D-74, Ghiya Marg, Bani Park, Jaipur, Rajasthan 302016</span></a>
        </div>
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
    console.log("error",error);
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
