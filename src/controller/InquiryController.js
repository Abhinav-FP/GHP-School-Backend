const catchAsync = require("../utils/catchAsync");
const Inquiry = require("../db/Inquiry");

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
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address with name
      to: "a.mathur@futureprofilez.com", // recipient address
      subject: `New inquiry received`, // Subject line
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
                  <td style="padding: 2.2rem 1.2rem; ">
                      <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Dear Admin,</p>
                      <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">We have received a new inquiry.Please find the details attached below.</p>
                      <tr>
                          <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                              <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Name</span><b style="font-weight:normal;margin:0">${name}</b></p>
                              <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Email</span> ${email}</p>
                              <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Contact No</span> ${contact}</p>
                              <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Message </span> <br/>${message}</p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:35px;"></td>
                      </tr>
                  </td>
              </tr>
                      <tr>
                  <td style="text-align: left;padding:1.2rem; border-top:1px solid #ddd;background: #FCFBF4;">
                       
                      <div style="margin: 0 0 10px">
                           <img style="margin-right: 3px; vertical-align: top;" src="https://i.imgur.com/r38PMig.png" alt="img"> 
                           <a href="tel:01412282790"  style="color:#1E1E1E; font-size:14px; text-decoration: none; opacity: 0.8;">01412282790</a><span style="opacity: 0.8;color:#1E1E1E;font-size:14px;">/</span>
                           <a href="tel:01412282298"  style="color:#1E1E1E; font-size:14px; text-decoration: none; opacity: 0.8;">01412282298</a><span style="opacity: 0.8;color:#1E1E1E;font-size:14px;">/</span>
                           <a href="tel:+919001869684"  style="color:#1E1E1E; font-size:14px; text-decoration: none; opacity: 0.8;">90018-69684</a>
                      </div>
                      <div style="margin: 0 0 10px">
                      <img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/fkOiYJA.png" alt="img"> 
                         <a href="mailto:bvbpschool74@gmail.com" style="color:#1E1E1E; font-size:14px; text-decoration: none; opacity: 0.8;">bvbpschool74@gmail.com</a><span style="opacity: 0.8;color:#1E1E1E;font-size:14px;">/</span>
                        <a href="mailto:bvbschool74@gmail.com" style="color:#1E1E1E; font-size:14px; text-decoration: none; opacity: 0.8;">bvbschool74@gmail.com</a>
                      </div>
                      <div style="line-height: 24px;">
                       <a href="https://www.google.com/maps/dir//D,+74,+Ghiya+Marg,+Sindhi+Colony,+Bani+Park,+Jaipur,+Rajasthan+302032+@26.931568,75.791982/@27.7436422,76.5794786,7z/data=!4m7!4m6!1m1!4e2!1m2!1m1!1s0x396db3efafa594ef:0x2da3b3ab79a793f4!3e0" target="blank" style="color:#1E1E1E; font-size:14px; text-decoration: none;"><img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/3Edc9vy.png" alt="img"> <span style="opacity: 0.8">D-74, Ghiya Marg, Bani Park,Jaipur, Rajasthan 302016</span></a>
                      </div>
                  </td>
              </tr>
              <tr>
			<td style="text-align: left;padding:1.2rem; border-top:1px solid #ddd;background: #FCFBF4;">
				 
				<div style="margin: 0 0 10px">
				 	<a href="https://www.facebook.com/profile.php?id=61557061876412" target="blank" style="color:#1E1E1E; font-size:14px; text-decoration: none;"><img style="margin-right: 3px; vertical-align: top;" src="https://i.imgur.com/V9oVERP.png" alt="img"> <span style="opacity: 0.8">Bal Vishwa Bharti</span></a>
				</div>
				<div style="margin: 0 0 10px">
				 <a href="https://www.instagram.com/bvbschool?igsh=ZTR5ZWl3bmdjYThv" target="blank" style="color:#1E1E1E; font-size:14px; text-decoration: none;"><img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/62XwWev.png" alt="img"> <span style="opacity: 0.8">@bvbschool</span></a>
				</div>
				<div>
				 <a href="https://www.youtube.com/@bvbschool-t9z" target="blank" style="color:#1E1E1E; font-size:14px; text-decoration: none;"><img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/nNeewpA.png" alt="img"> <span style="opacity: 0.8">@bvbschool-t9z</span></a>
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
    const deletedEnquiry = await Inquiry.findOneAndDelete({ _id: id });
    if (!deletedEnquiry) {
      return res.status(404).json({
        status: false,
        message: `No data found with Enquiry`,
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
