const catchAsync = require("../utils/catchAsync");
const AdmissionForm = require("../db/AdmissionForm");
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

exports.formAdd = catchAsync(async (req, res, next) => {
  try {
    const {
      class: className,
      optional,
      date,
      aadhar,
      scholar,
      name,
      dobWords,
      type,
      dob,
      fatherName,
      fatherOccupation,
      fatherPhone,
      motherName,
      motherOccupation,
      motherPhone,
      guardianName,
      guardianOccupation,
      guardianPhone,
      fatheremail,
      email,
      address,
      school,
      class_percentage,
      sibling,
      belongs,
      facility,
      payment_id, 
      order_id, 
      amount,
      image,
      birth,
      additional
    } = req.body;
    const newAdmission = new AdmissionForm({
      class: className,
      optional,
      date,
      aadhar,
      scholar,
      name,
      dobWords,
      type,
      dob,
      fatherName,
      fatherOccupation,
      fatherPhone,
      motherName,
      motherOccupation,
      motherPhone,
      guardianName,
      guardianOccupation,
      guardianPhone,
      fatheremail,
      email,
      address,
      school,
      class_percentage,
      sibling,
      belongs,
      facility,
      payment_id, 
      order_id, 
      amount,
      image,
      birth,
      additional
    });
    await newAdmission.save();
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: `${fatheremail}`,
      subject: "Admission Form Submitted ",
      html: `
       <html>
<head>
  <title>Email template</title>
</head>
<body>
  <table cellspacing="0" cellpadding="0" style="width: 100%;max-width: 400px;margin: 0 auto;font-family: Arial; ">
    <tr>
      <td style="text-align: center;background:#ECE1C5;padding: 10px 10px 0;">
        <a href="https://ghp-school.vercel.app/">
          <img style="max-width:100%;" src="https://i.imgur.com/eGTKYS0.png" alt="img">
        </a>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;background:#ECE1C5;">        
        <img style="max-width:100%;" src="https://i.imgur.com/RppnXIQ.png" alt="img"> 
      </td>
    </tr>
    <tr>
       <td style="padding: 2.2rem 1.2rem; ">
         <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Dear Parents,</p>
         <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">We are pleased to inform you that we have received your application form for admission of ${name} at Bal Vishwa Bharti School. We appreciate your interest in our school and thank you for choosing us for your child's education.</p>
         <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">As per our process, ${name} will be required to appear for an admission test. You will receive further details regarding the test schedule shortly.</p>
         <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">We look forward to welcoming ${name} to our school community. If you have any questions, please feel free to contact us at <a href="tel:90018-69684"  style="color: #4D4D4D;font-size: 14px;text-decoration: none;">90018-69684</a>.</p>
          <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0"> Warm Regards, <br>
                  Bal Vishwa Bharti Senior Secondary School</p>    
       </td>
    </tr>
    <tr>
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
    return res.status(201).json({
      status: true,
      message: "Admission form submitted successfully.",
      data: newAdmission,
    });
  } catch (error) {
    console.error("Error saving admission form:", error);
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.formGet = catchAsync(async (req, res, next) => {
  try {
    const data = await AdmissionForm.find({});
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      banners: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});
