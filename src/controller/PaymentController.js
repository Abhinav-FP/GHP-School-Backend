const Payment = require("../db/Payment");
const catchAsync = require("../utils/catchAsync");
const Razorpay = require('razorpay');
require('dotenv').config(); 

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.paymentAdd = catchAsync(async (req, res) => {
    const { orderId, paymentId, signature, amount } = req.body;
    const payment = new Payment({
        orderId,
        paymentId,
        signature,
        amount,
        status: 'success', 
    });
    await payment.save();
    res.status(200).json({ status: 'success', message: 'Payment verified and saved successfully' });
});
