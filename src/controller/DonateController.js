const fs = require("fs");
const pdf = require("html-pdf-node");
const catchAsync = require("../utils/catchAsync");
const Donate = require("../db/Donate");
const DonationUser = require("../db/DonationUser");

// Email logic
const nodemailer = require("nodemailer");
const uploadToMega = require("../utils/uploadToMega");
const invoice = (InvoiceNo, name,formattedDate, amount, amount_in_words, tuition, book, uniform, all, other, pan) => {
  return `
   <!DOCTYPE html>
 <html>
   <head>
     <title>Gram Vishwa Bharti Samiti</title>
     <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,400;0,700;1,400&family=Inter:opsz,wght@14..32,100..900&display=swap" rel="stylesheet">
     <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari&display=swap" rel="stylesheet">
   </head>
   <body style="background: #e3e3e3; font-family: 'Noto Serif Devanagari', 'Inria Serif', serif;">
     <table cellpadding="0" cellspacing="0" width="100%;" style="max-width: 800px;margin: auto;background: #fff;">
       <tr>
         <td style="text-align: center;padding: 10px 14px 8px;">
           <img src="https://i.imgur.com/MkTFiNS.png" style="height:58px; width:103px" alt="logo" />
         </td>
       </tr>
       <tr>
         <td style="color: #EE834E; font-weight: 700;font-size: 40px;text-align: center;padding: 0 14px 3px;font-family: 'Inria Serif', serif;line-height: 40px;"> Gram Vishwa Bharti Samiti </td>
       </tr>
       <tr>
         <td style="color: #1B1B1B;padding: 0 14px 7px;font-size: 12px;font-weight: 400;text-align: center;font-family: 'Inria Serif', serif;"> आदेश एस.एन. आ. आ. प्रथम/80-जी/111/12/2011-12/2016 dt 2/2/2012 valid from 30/6/2011 </td>
       </tr>
       <tr>
         <td style="color: #1B1B1B;padding: 0 14px 0px;font-size: 16px;font-weight: 700;text-align: center;font-family: 'Inria Serif', serif;">(Bal Vishwa Bharti Public Sr. Sec. School) </td>
       </tr>
       <tr>
         <td style="color: #1B1B1B;padding: 0 14px 25px;font-size: 16px;font-weight: 700;text-align: center;font-family: 'Inria Serif', serif;">Nursery To Senior Secondary </td>
       </tr>
       <tr>
         <td style="color: #1B1B1B;padding: 0 14px 20px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;">Receipt No. - OD-${InvoiceNo} </td>
       </tr>
       <tr>
         <td style="padding: 0 12px;">
           <table cellpadding="0" cellspacing="0" width="100%;">
             <tr>
               <td style="color: #1B1B1B;padding: 0 2px 20px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;width: 70%;">
                 <table cellpadding="0" cellspacing="0" width="100%;">
                   <tr>
                     <td style="width: 10%;">Name</td>
                     <td style="width: 90%; border-bottom: 1px dotted #1B1B1B; position: relative;">
                       <span style="position: absolute; top: -1px; left: 0; background-color: white; padding: 0 0px;"> ${name} </span>
                     </td>
                   </tr>
                 </table>
               </td>
               <td style="color: #1B1B1B;padding: 0 2px 20px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;width: 30%;">
                 <table cellpadding="0" cellspacing="0" width="100%;">
                   <tr>
                     <td style="width: 20%">Date</td>
                     <td style="width:80%;border-bottom: 1px dotted #1B1B1B; position: relative;">
                       <span style="position: absolute; top: -1px; left: 0; background-color: white; padding: 0 0px;"> ${formattedDate} </span>
                     </td>
                   </tr>
                 </table>
               </td>
             </tr>
             <tr>
               <td style="color: #1B1B1B;padding: 0 2px 20px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;width: 70%;">
                 <table cellpadding="0" cellspacing="0" width="100%;">
                   <tr>
                     <td style="width: 22%">Father’s Name </td>
                     <td style="width:78%;border-bottom: 1px dotted #1B1B1B;"></td>
                   </tr>
                 </table>
               </td>
               <td style="color: #1B1B1B;padding: 0 2px 20px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;width: 30%;">
                 <table cellpadding="0" cellspacing="0" width="100%;">
                   <tr>
                     <td style="width: 20%">Class</td>
                     <td style="width:80%;border-bottom: 1px dotted #1B1B1B;"></td>
                   </tr>
                 </table>
               </td>
             </tr>
           </table>
         </td>
       </tr>
       <tr>
         <td style="padding: 0 14px;">
           <table cellpadding="0" cellspacing="0" width="100%;">
             <thead>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 9px 2px 10px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif;width: 65%;border-top: 1px solid #1B1B1B;border-bottom: 1px solid #1B1B1B;border-right: 1px solid #1B1B1B;  "> Details </td>
                 <td valign="bottom" style="color: #1B1B1B;padding:  9px 2px 10px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif;width: 35%;border-top: 1px solid #1B1B1B;border-bottom: 1px solid #1B1B1B; "> Amount <span style="font-size: 10px">(In Rs.)</span>
                 </td>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 10px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 1. Tuition Fees/Child </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 10px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; "> ${tuition} </td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 2. Book Set/Child </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; ">${book}</td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 3. Uniform Set/Child </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; ">${uniform}</td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 4. Tuition Fees with Book & Uniform Set </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; ">${all}</td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 5. Others </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; ">${other}</td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 6. Pan Number </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; ">${pan}</td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 7................................. </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; "></td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 8.................................. </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; "></td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "> 9.................................. </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; "></td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "></td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; "></td>
               </tr>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: left;font-family: 'Inter', serif;border-right: 1px solid #1B1B1B;  "></td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 5px 2px 5px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; "></td>
               </tr>
             </tbody>
             <tfoot>
               <tr>
                 <td valign="center" style="color: #1B1B1B;padding: 7px 14px 7px;font-size: 16px;font-weight: 500;text-align: right;font-family: 'Inter', serif; border-bottom: 1px solid #1B1B1B;border-right: 1px solid #1B1B1B;  "> Total </td>
                 <td valign="bottom" style="color: #1B1B1B;padding: 7px 2px  7px;font-size: 16px;font-weight: 500;text-align: center;font-family: 'Inter', serif; border-top: 1px solid #1B1B1B;border-bottom: 1px solid #1B1B1B; ">${amount}</td>
               </tr>
             </tfoot>
           </table>
         </td>
       </tr>
       <tr>
         <td style="color: #1B1B1B; padding: 15px 14px 20px; font-size: 16px; font-weight: 500; text-align: left; font-family: 'Inter', serif; word-break: break-all; line-height: 1.5;"> Cheque of Rupees <span style="display: inline-block; width: 80%; border-bottom: 1px dotted #000; text-align: left;"> ${amount_in_words} </span>
         </td>
       </tr>
       <tr>
         <td style="color: #1B1B1B; padding: 35px 30px 18px; font-size: 16px; font-weight: 500; text-align: right; font-family: 'Inter', serif; word-break: break-all;">
           <table style="width:100%">
             <tr>
               <td>
                 <img src="https://ghp-school.vercel.app/Signature.png" alt="Signatory Image" style="height:40.5px; width:193.25px; margin: 0; padding: 0; text-align: right;">
               </td>
             </tr>
             <tr>
               <td>
                 <p>Authorized signatory</p>
               </td>
             </tr>
           </table>
         </td>
       </tr>
       <tr>
         <td style="color: #fff;padding: 8px 25px 8px;font-size: 12px;font-weight: 500;text-align: left;font-family: 'Inter', serif; word-break: break-all;background: #EE834E">
           <table cellpadding="0" cellspacing="0" width="100%;">
             <tr>
               <td width="60%" style="text-align: left;">
                 <img style="margin-right: 5px;vertical-align: middle;" src="https://i.imgur.com/xoIdFmr.png" alt="img" /> D-74, Ghiya Marg, Bani Park, Jaipur, Rajasthan 302016
               </td>
               <td width="5%" style="text-align: center;padding: 0 5px;">|</td>
               <td width="35%" style="text-align: right;">
                 <img style="margin-right: 5px;vertical-align: middle;" src="https://i.imgur.com/XcqviKw.png" alt="img" /> 01412282790/ 01412282298
               </td>
             </tr>
           </table>
       </tr>
     </table>
   </body>
 </html>
  `;
};
const CSR = (date, pan) => {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <title>GOVERNMENT OF INDIA</title>
    <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,400;0,700;1,400&family=Inter:opsz,wght@14..32,100..900&display=swap" rel="stylesheet">
  </head>
  <body style="background: #e3e3e3;">
    <table cellpadding="0" cellspacing="0" width="100%;" style="max-width: 595px;margin: auto;background: #fff;">
      <tr>
        <td style="text-align: center;padding:25px 24px 6px;">
          <img src="https://i.imgur.com/I8II5cO.png" alt="logo" />
        </td>
      </tr>
      <tr>
        <td style="color: #1B1B1B; font-weight: 600;font-size: 18px;text-align: center;padding: 0 24px 6px;font-family: 'Inter', serif;line-height: 21px;text-transform: uppercase;">GOVERNMENT OF INDIA </td>
      </tr>
      <tr>
        <td style="color: #1B1B1B;padding: 0 24px 6px;font-size: 14px;font-weight: 500;text-align: center;font-family: 'Inter', serif;line-height: 16px;text-transform: uppercase;">MINISTRY OF CORPORATE AFFAIRS </td>
      </tr>
      <tr>
        <td style="color: #1B1B1B;padding: 0 24px 18px;font-size: 14px;font-weight: 500;text-align: center;font-family: 'Inter', serif;line-height: 16px;">OFFICE OF THE REGISTRAR OF COMPANIES </td>
      </tr>
      <tr>
        <td style="color: #232323;padding: 20px 24px 18px;font-size: 12px;font-weight: 500;text-align: left;font-family: 'Inter', serif;">Dated : ${date} </td>
      </tr>
      <tr>
        <td style="color: #1B1B1B;padding: 5px 24px 18px;font-size: 12px;font-weight: 500;text-align: left;font-family: 'Inter', serif;">
          <strong>NOTE</strong> - THIS LETTER IS ONLY AN APPROVAL FOR REGISTRATION OF THE ENTITIES FOR UNDERTAKING CSR ACTIVITIES.
        </td>
      </tr>
      <tr>
        <td style="color: #232323;padding: 18px 24px 5px;font-size: 12px;font-weight: 500;text-align: left;font-family: 'Inter', serif;">To, <br> GRAM VISHWA BHARTI SMITI , D-74, GHIYA MARG BANI PARK , JAIPUR, RJ, 302016 </td>
      </tr>
      <tr>
        <td style="color: #000;padding: 10px 24px 18px;font-size: 12px;font-weight: 700;text-align: left;font-family: 'Inter', serif;">
          <strong>PAN : ${pan}</strong>
        </td>
      </tr>
      <tr>
        <td style="color: #000;padding: 15px 24px 18px;font-size: 12px;font-weight: 400;text-align: left;font-family: 'Inter', serif;">
          <strong>Subject :</strong> In Reference to Registraton of Entities for undertaking CSR activities <br>
          <strong>Reference :</strong> Your application dated ${date}
        </td>
      </tr>
      <tr>
        <td style="color: #000;padding: 10px 24px 9px;font-size: 12px;font-weight: 400;text-align: left;font-family: 'Inter', serif;">Sir/Madam, </td>
      </tr>
      <tr>
        <td style="color: #000;padding: 10px 24px 9px;font-size: 12px;font-weight: 400;text-align: left;font-family: 'Inter', serif;">With reference to the above , it is informed that the entity has been registered for undertaking CSR activities and the Registration number is <strong>CSR0078754</strong>, Please refer the registration number for any further communication. </td>
      </tr>
      <tr>
        <td height="100" style="color: #000;padding: 10px 24px 10px;font-size: 12px;font-weight: 400;text-align: left;font-family: 'Inter', serif;"></td>
      </tr>
      <tr>
        <td style="color: #000;padding: 0 24px 0;font-size: 12px;font-weight: 400;text-align: left;font-family: 'Inter', serif;">
          <table cellpadding="0" cellspacing="0" width="100%;">
            <tr>
              <td width="70%"></td>
              <td width="00%" style="font-size: 12px;font-weight: 400;text-align: center;font-family: 'Inter', serif;padding: 8px 0;">Registrar of Companies</td>
            </tr>
            <tr>
              <td></td>
              <td style="font-size: 12px;font-weight: 500;text-align: center;font-family: 'Inter', serif;padding: 8px 0;">ROC-DELHI</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="color: #000;padding: 30px 24px 10px;font-size: 10px;font-weight: 400;text-align: left;font-family: 'Inter', serif;">
          <strong>Note :</strong>
          <span style="font-style: italic;">The corresponding form has been approved and this letter has been digitally signed through a system digital signature</span>.
        </td>
      </tr>
      <tr>
        <td height="30px"></td>
      </tr>
    </table>
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
      return false;
    }
  } catch (error) {
    console.log("Mail error:", error);
    return false;
  }
};

// Number to words
const numberToWords = (num) => {
  const belowTwenty = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];
  const thousands = ['','Thousand','Million','Billion','Trillion'];

  if (num === 0) return 'Zero';

  let words = '';
  let i = 0;
  
  while (num > 0) {
    if (num % 1000 !== 0) {
      words = helper(num % 1000) + thousands[i] + ' ' + words;
    }
    num = Math.floor(num / 1000);
    i++;
  }
  return words.trim();

  function helper(num) {
    if (num === 0) return '';
    if (num < 20) return belowTwenty[num] + ' ';
    if (num < 100) return tens[Math.floor(num / 10)] + ' ' + helper(num % 10);
    return belowTwenty[Math.floor(num / 100)] + ' Hundred ' + helper(num % 100);
  }
}

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
  const { name, number, aadhar, pan, email, amount, payment_id, pannumber, items } =
    req.body;

  // Validate input fields
  if (
    !name ||
    !number ||
    !aadhar ||
    !pan ||
    !email ||
    !amount ||
    !payment_id ||
    !pannumber ||
    !items
  ) {
    return res.status(400).json({
      status: false,
      message: "All fields are required!",
    });
  }
  
  console.log("items",items);
  // Get all items with their indivisual price
  let itemsjson=JSON.parse(items);
  console.log("itemsjson",itemsjson);
  let tuition = "", book = "", uniform = "", all = "", other = "";
itemsjson.forEach(item => {
  if (item?.name == "Book Set/Child") {
    book = item.totalPrice;
  } else if (item?.name == "Tuition Fees/Child") {
    tuition = item.totalPrice;
  } else if (item?.name == "Uniform Set/Child") {
    uniform = item.totalPrice;
  } else if (item?.name == "Tuition Fees with Book & Uniform Set") {
    all = item.totalPrice;
  } else {
    if(other==""){
      other = item.totalPrice;
    }
    else{other+=item?.totalPrice}
  }
});
console.log("data",{ tuition, book, uniform, all, other });

  const lastitem = await DonationUser.findOne().sort({ srNo: -1 });
  const srNo = lastitem ? lastitem.srNo + 1 : 1;

  // Generate the random HTML content for the invoice
  const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const year = today.getFullYear();
const formattedDate = `${day}-${month}-${year}`;
const amount_in_words=numberToWords(amount);
let InvoiceNo;
if(srNo<10){srNo.toString().padStart(2, "0");}
else{InvoiceNo=srNo;}

// HTML generator
  const invoiceHTML = invoice(InvoiceNo,name,formattedDate, amount, amount_in_words, tuition, book, uniform, all, other, pannumber);
  const CSRHTML = CSR(formattedDate, pannumber);

  // Convert the random HTML to a PDF buffer
  const options1 = {
    width: "800px", // Custom width
    height: "968.219px", // Custom height
    preferCSSPageSize: true, // Uses CSS page size if defined in styles
    printBackground: true, // Ensures background colors and images are printed
  };
  const invoicefile = { content: invoiceHTML };
  const CSRfile = { content: CSRHTML };

  // Invoice
  let invoicepdf;
  try {
    invoicepdf = await pdf.generatePdf(invoicefile, options1);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to generate PDF",
    });
  }
  console.log("One pdf done");
  // CSR certificate
  const options2 = { 
    width: "595px", 
    height: "891px", 
    preferCSSPageSize: true, 
    printBackground: true, 
   };
  let CSRpdf;
  try {
    CSRpdf = await pdf.generatePdf(CSRfile, options2);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to generate PDF",
    });
  }
  console.log("Second pdf done");

  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
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
            <td style="padding: 2.2rem 1.2rem;">
              <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">Dear ${name},</p>
              <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">We are pleased to inform you that your donation has been successfully received. We are deeply grateful for your generous support. Your contribution will make a significant impact and help us continue our mission to inspire and educate future generations.</p>
              <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">Your invoice is attached to this email. To avail yourself of tax benefits under Section 80G, kindly download and print a copy of the invoice for your records.</p>
              <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">Thank you once again for your valuable contribution.</p>
              <p style="color: #4D4D4D;font-size: 14px;font-weight: 400; text-align: left;">Warm Regards,<br>Bal Vishwa Bharti Senior Secondary School</p>
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
    attachments: [
      {
        filename: "invoice.pdf",
        content: invoicepdf,
      },
      {
        filename: "CSR.pdf",
        content: CSRpdf,
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
  console.log("Email sent successfully!");

  const megaLink = await uploadToMega(invoicepdf);
  const csrlink = await uploadToMega(CSRpdf);
  console.log("Uploaded to mega successfully");
  const newItem = new DonationUser({
    srNo,
    name,
    number,
    aadhar,
    pan,
    email,
    amount,
    payment_id,
    link: megaLink,
    pannumber,
    CSRlink: csrlink,
  });
  console.log("Item created successfully");
  await newItem.save();

  res.status(200).json({
    status: true,
    message: "Donation user added and email sent successfully!",
    link: megaLink,
  });
});

exports.DonateInvoiceGet = catchAsync(async (req, res, next) => {
  try {
    const { payment_id } = req.params;
    let data = await DonationUser.findOne({ payment_id }).select("link");
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
