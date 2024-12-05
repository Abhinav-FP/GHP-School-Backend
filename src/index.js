const dotenv = require("dotenv");
require("./mongoconfig");
dotenv.config();

const express = require("express");
const multer = require("multer"); 
const app = express();
const cors = require("cors");
const path = require("path");
const { principalAdd, principalEdit } = require("./controller/PrincipalController");
let upload = require("./utils/uploadConfig");
const { directorAdd, directorEdit } = require("./controller/DirectorController");
const { bannerAdd } = require("./controller/BannerController");
const { resultAdd } = require("./controller/ResultController");
const { galleryAdd } = require("./controller/GalleryController");
const uploadgallery = require("./utils/uploadGallery");
const { verifyToken } = require("./controller/AuthController");
const cron = require("node-cron");
const axios = require("axios");

const corsOptions = {
  origin: ['https://ghp-school.vercel.app', 'http://localhost:3000'], // Allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*', // Allow all headers
  credentials: true,
  optionsSuccessStatus: 200, // for legacy browsers
}

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Handle preflight requests for POST routes
app.options("*", cors(corsOptions));

// Parsing middlewares
app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ extended: true }));

upload = multer();
app.use(upload.none()); 

app.use("/user", require("./routes/userRoutes"));
app.use("/about", require("./routes/aboutRoutes"));
app.use("/career", require("./routes/careerRoutes"));
app.use("/home", require("./routes/homeRoutes"));
app.post("/home/banner/add", verifyToken, bannerAdd);
app.post("/result/add", verifyToken, resultAdd);
app.post("/about/principal/add", verifyToken, principalAdd);
app.post("/about/principal/edit", verifyToken, principalEdit);
app.post("/about/director/add", verifyToken, directorAdd);
app.post("/about/director/edit", verifyToken, directorEdit);
app.use("/result", require("./routes/resultRoutes"));
app.use("/fees", require("./routes/feesRoutes"));
app.use("/facilities", require("./routes/facilitiesRoutes"));
app.use("/donation", require("./routes/donationRoutes"));
app.use("/inquiry", require("./routes/InquiryRoutes"));
app.use("/academics", require("./routes/academicsRoutes"));
app.use("/admissionform", require("./routes/admissionFormRoutes.js"));
app.use("/payment", require("./routes/Paymentroute"));
// Gallery Upload route
app.post("/facilities/gallery/add", galleryAdd);

app.use('/images', express.static(path.join(__dirname, 'images')));

const PORT = process.env.REACT_APP_SERVER_DOMIN || 5000; // Add default port

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
// Schedule a cron job to hit the URL every 15 minutes
cron.schedule("*/2 * * * *", async () => {
  try {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address with name
      to: "a.mathur@futureprofilez.com", // recipient address
      subject: `Server cron job`, // Subject line
      html: `
     <html>
      <head>
          <title>Email template</title>
      </head>
      <body>
         <table cellspacing="0" cellpadding="0" style="width: 100%;max-width: 400px;margin: 0 auto;font-family: Arial;">
            <tr>
                <td style="text-align: center;background:#ECE1C5;padding:10px 10px;">
                    <a href="https://ghp-school.vercel.app/">
                        <img style="max-width:107px; height:58px" src="https://ghp-school.vercel.app/Header/Logo.png" alt="img">
                    </a>
                </td>
            </tr>
            <tr>
            Hello World
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
    console.log("Cron job running: hitting the URL");
    const response = await axios.get("https://ghp-school-backend.onrender.com");
    console.log("Response status:", response.status);
  } catch (error) {
    console.error("Error hitting the URL:", error.message);
  }
})

app.get("/", (req, res) => {
  res.json({
    msg: 'Okay',
    status: 200,
  });
});

const server = app.listen(PORT, () => console.log("Server is running at port : " + PORT));
server.timeout = 360000; // 6 minutes
