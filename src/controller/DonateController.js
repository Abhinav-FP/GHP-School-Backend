const catchAsync = require("../utils/catchAsync");
const Donate = require("../db/Donate");
const DonationUser = require("../db/DonationUser");
const generatePDF = require('../utils/generatePDF');
const nodemailer = require("nodemailer");
 
const generateRandomHTML = () => {
  return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; }
        .invoice-box table { width: 100%; line-height: inherit; text-align: left; }
        .invoice-box table td { padding: 5px; }
        .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
        .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <h1>Random Invoice</h1>
        <table>
          <tr class="heading">
            <td>Item</td>
            <td>Price</td>
          </tr>
          <tr class="item">
            <td>Donation Service</td>
            <td>$${Math.floor(Math.random() * 100) + 50}</td>
          </tr>
          <tr class="item">
            <td>Additional Support</td>
            <td>$${Math.floor(Math.random() * 50) + 20}</td>
          </tr>
          <tr class="total">
            <td></td>
            <td>Total: $${Math.floor(Math.random() * 150) + 70}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
}; 
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
      console.error("Mail not sent: no message ID returned");
      return false;
    }
  } catch (error) {
    console.error("Mail error:", error);
    return false;
  }
};

// async function generatePDF(htmlContent) {
//   let browser;
//   try {
//     // const executablePath = 
//     //   process.env.NODE_ENV === 'production'
//     //     ? await chromium.executablePath
//     //     : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
//     const executablePath =  await chromium.executablePath;

//     browser = await puppeteer.launch({
//       args: chromium.args,
//       defaultViewport: chromium.defaultViewport,
//       executablePath,
//       headless: true,
//     });

//     const page = await browser.newPage();
//     await page.setContent(htmlContent);
//     const pdfBuffer = await page.pdf({ format: 'A4' });
//     return pdfBuffer;
//   } catch (error) {
//     console.error("PDF generation error:", error);
//     throw new Error("Failed to generate PDF");
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// }

// function generatePDF(element) {
//   // const element = document.getElementById('content'); // The element to be converted to PDF
//   const options = {
//     margin:       1,
//     filename:     'document.pdf',
//     image:        { type: 'jpeg', quality: 0.98 },
//     html2canvas:  { scale: 2 },
//     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
//   };

//   // Generate PDF
//   html2pdf()
//     .from(element)
//     .set(options)
//     .save(); 
// }



exports.DonateAdd = catchAsync(async (req, res, next) => {
  try {
    const { name, description, price, photo, hash } = req.body;
    if (!name || !description || !price || !photo) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const lastitem = await Donate.findOne().sort({ srNo: -1 });
    const srNo = lastitem ? lastitem.srNo + 1 : 1;
    const newItem = new Donate({
      srNo,
      name,
      description,
      price,
      photo,
      imagehash: hash,
    });
    await newItem.save();
    res.status(201).json({
      status: "success",
      message: "Item Added Successfully!",
      data: {
        donate: newItem,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.DonateGet = catchAsync(async (req, res, next) => {
  try {
    const { srNo } = req.params;
    let data;
    if (srNo) {
      data = await Donate.findOne({ srNo });
    } else {
      data = await Donate.find().sort({ srNo: 1 });
    }
    if (!data) {
      res.status(200).json({
        status: false,
        message: "No data found!",
        data: [],
      });
    }
    res.status(200).json({
      status: true,
      message: "Data retrieved successfully!",
      data: data,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.DonateDelete = catchAsync(async (req, res, next) => {
  try {
    const { srNo } = req.body;
    // Validate the input
    if (!srNo) {
      return res.status(400).json({
        status: false,
        message: "(srNo) is required",
      });
    }

    // Find and delete the banner
    const deletedBanner = await Donate.findOneAndDelete({ srNo });
    if (!deletedBanner) {
      return res.status(404).json({
        status: false,
        message: `No data found with srNo: ${srNo}`,
      });
    }
    // Adjust the `srNo` for the other banners
    const BannersToUpdate = await Donate.find({ srNo: { $gt: srNo } });
    if (BannersToUpdate.length > 0) {
      await Banner.updateMany({ srNo: { $gt: srNo } }, { $inc: { srNo: -1 } });
    }

    // Respond with success
    return res.status(200).json({
      status: true,
      message: `Item deleted successfully`,
      deletedBanner: deletedBanner,
    });
  } catch (error) {
    console.error("Error:", error); // Log the error to see details
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.DonateUserAdd = catchAsync(async (req, res, next) => {
  try {
    const { name, number, aadhar, pan, email, amount, payment_id } = req.body;
    if (
      !name ||
      !number ||
      !aadhar ||
      !pan ||
      !email ||
      !amount ||
      !payment_id
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    console.log("Hello")
    const lastitem = await DonationUser.findOne().sort({ srNo: -1 });
    const srNo = lastitem ? lastitem.srNo + 1 : 1;
    const newItem = new DonationUser({
      srNo,
      name,
      number,
      aadhar,
      pan,
      email,
      amount,
      payment_id,
    });
    await newItem.save();
     // Generate the random HTML content for the invoice
     const randomHtml = generateRandomHTML();

     // Convert the random HTML to a PDF buffer
     const pdfBuffer = await generatePDF(randomHtml);
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address with name
      to: `${email}`, // recipient address
      subject: `Thank You for Your Generosity!`, // Subject line
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
					<img style="max-width:100%;" src="https://i.imgur.com/eGTKYS0.png" alt="img">
				</a>
			</td>
		</tr>
		<tr>
			<td style="text-align: center;background:#ECE1C5;">				 
				<img style="max-width:100%;" src="https://i.imgur.com/Uscg2C5.png" alt="img"> 
			</td>
		</tr>
		<tr>
			 <td style="padding: 2.2rem 1.2rem; ">
				<p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Thank You for Your Generosity!</p>
			 	 <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Dear ${name},</p>
			 	 <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">We are pleased to inform you that your donation has been successfully received, and we are deeply grateful for your generous support. Your contribution will make a significant impact and help us further our mission.</p>
			 	 <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Please check your email for the invoice. To download your CSR certificate and to claim tax benefits under Section 80G, kindly refer to the attached documents and print a copy of them at your convenience.</p>
			 	 <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Thank you once again for your valuable contribution.</p>
			 	  <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0"> Warm Regards, <br>
                  Bal Vishwa Bharti Senior Secondary School</p>
			 	 
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
				 <a href="https://www.instagram.com/bvbschool?igsh=ZTR5ZWl3bmdjYThv" target="blank" style="color:#1E1E1E; font-size:14px; text-decoration: none;"><img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/nNeewpA.png" alt="img"> <span style="opacity: 0.8">@bvbschool-t9z</span></a>
				</div>
				 
			</td>
		</tr>
	</table>
</body>
</html> 
      `,
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
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
      message: "Data Added Successfully!",
      data: {
        donationUser: newItem,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
      err:error,
    });
  }
});


exports.testingpdf = catchAsync(async (req, res, next) => { 
  try {
    const { email } = req.body;
    const randomHtmlContent = "This is the content of your PDF."; // Replace with your dynamic content

    // Generate the PDF buffer
    const pdfBuffer = await generatePDF(randomHtmlContent);

    // Prepare email options
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address with name
      to: `${email}`, // recipient address
      subject: `Thank You for Your Generosity!`, // Subject line
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
					<img style="max-width:100%;" src="https://i.imgur.com/eGTKYS0.png" alt="img">
				</a>
			</td>
		</tr>
		<tr>
			<td style="text-align: center;background:#ECE1C5;">				 
				<img style="max-width:100%;" src="https://i.imgur.com/Uscg2C5.png" alt="img"> 
			</td>
		</tr>
		<tr>
			 <td style="padding: 2.2rem 1.2rem; ">
				<p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Thank You for Your Generosity!</p>
			 	 <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Dear ,</p>
			 	 <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">We are pleased to inform you that your donation has been successfully received, and we are deeply grateful for your generous support. Your contribution will make a significant impact and help us further our mission.</p>
			 	 <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Please check your email for the invoice. To download your CSR certificate and to claim tax benefits under Section 80G, kindly refer to the attached documents and print a copy of them at your convenience.</p>
			 	 <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 1.3rem;">Thank you once again for your valuable contribution.</p>
			 	  <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0"> Warm Regards, <br>
                  Bal Vishwa Bharti Senior Secondary School</p>
			 	 
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
				 <a href="https://www.instagram.com/bvbschool?igsh=ZTR5ZWl3bmdjYThv" target="blank" style="color:#1E1E1E; font-size:14px; text-decoration: none;"><img style="margin-right: 3px; vertical-align: middle;" src="https://i.imgur.com/nNeewpA.png" alt="img"> <span style="opacity: 0.8">@bvbschool-t9z</span></a>
				</div>
				 
			</td>
		</tr>
	</table>
</body>
</html> 
      `,
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const sendMailResponse = await sendMail(mailOptions);
    if (!sendMailResponse) {
      console.log("Email sent successfully");
      throw new Error("Failed to send email");
    }

    res.status(201).json({
      status: "success",
      message: "Data Added Successfully!"
    });
 } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
      err: error,
    });
  }
});