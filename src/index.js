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
const  generatePdf  = require("./helper/pdfService.js");

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






// PDF Generator route
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


app.get("/pdf", async(req, res) => {
  try{
  const htmlContent = "<html><body><h1>Hello, PDF!</h1></body></html>";
    const pdfBuffer = await generatePdf(htmlContent);
    console.log("pdfBuffer",pdfBuffer);

    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: "a.mathur@futureprofilez.com",
      subject: `Thank You for Your Donation!`,
      html: `
      <html>
        <head><title>Email template</title></head>
        <body>
          <table cellspacing="0" cellpadding="0" style="width: 100%;max-width: 400px;margin: 0 auto;font-family: Arial;">
            <tr>
              <td style="text-align: center;background:#ECE1C5;padding: 10px 10px;">
                <a href="https://ghp-school.vercel.app/">
                  <img style="max-width:107px; height:58px" src="https://ghp-school.vercel.app/Header/Logo.png" alt="img">
                </a>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;background:#ECE1C5;">
                <img style="width:227px; height:191px" src="https://i.imgur.com/Jw1ILnw.png" alt="img"> 
              </td>
            </tr>
            <tr>
              <td style="padding: 35.2px 19.2px;">
                <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">Dear Name,</p>
                <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">We are pleased to inform you that your donation has been successfully received. We are deeply grateful for your generous support. Your contribution will make a significant impact and help us continue our mission to inspire and educate future generations.</p>
                <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">Your invoice is attached to this email. To avail yourself of tax benefits under Section 80G, kindly download and print a copy of the invoice for your records.</p>
                <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">Thank you once again for your valuable contribution.</p>
                <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">Warm Regards,<br>Bal Vishwa Bharti Senior Secondary School</p>
              </td>
            </tr>
            <tr>
        <tr>
        <td style="text-align: left;padding:19.2px; background: #ECE1C5;text-align: center;">
           
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
        <td style="text-align: left;padding:19.2px 19.2px 16px; border-top:1px solid rgba(0,0,0,.1);background: #ECE1C5; text-align: center;">
           
          <div style="margin: 0 0 10px">
            <img style="margin-right: 3px; vertical-align: top;" src="https://i.imgur.com/3OuZKWO.png" alt="img"> 
            <a href="tel:01412282790"  style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">01412282790</a><span style="opacity: 0.8;color:#4D4D4D;font-size:14px;">/</span>
            <a href="tel:01412282298"  style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">01412282298</a><span style="opacity: 0.8;color:#4D4D4D;font-size:14px;">/</span>
            <a href="tel:+919001869684"  style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">90018-69684</a>
          </div>
          <div style="margin: 0 0 10px">
          <img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/QFBWsuV.png" alt="img"> 
             <a href="mailto:bvbpschool74@gmail.com" style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">bvbpschool74@gmail.com</a><span style="opacity: 0.8;color:#4D4D4D;font-size:14px;">/</span>
            <a href="mailto:bvbpschool@yahoo.com" style="color:#4D4D4D; font-size:14px; text-decoration: none; opacity: 0.8;">bvbpschool@yahoo.com</a>
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
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
        },
      ],
    };
    
    // Send email with invoice PDF
    const emailSent = await sendMail(mailOptions);
    if (!emailSent) {
      return res.status(500).json({
        status: false,
        message: "Failed to send email",
      });
    }

  res.json({
    msg: 'Code Working fine',
    status: 200,
  });
}catch(error){
  console.log("error",error);
  res.json({
    msg: 'An error occured',
    status: 500,
  });    
}
});

const PORT = process.env.REACT_APP_SERVER_DOMIN || 5000; // Add default port

app.get("/", (req, res) => {
  res.json({
    msg: 'Okay',
    status: 200,
  });
});

const server = app.listen(PORT, () => console.log("Server is running at port : " + PORT));
server.timeout = 360000; // 6 minutes
