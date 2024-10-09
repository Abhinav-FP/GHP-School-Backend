const Payment = require("../db/Payment");
const catchAsync = require("../utils/catchAsync");
const Razorpay = require('razorpay');
require('dotenv').config(); 


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  exports.createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body; 
    try {
      const options = {
        amount: amount * 100, 
        currency,
        receipt,
        payment_capture: 1, 
      };
  
      const order = await razorpayInstance.orders.create(options);
  
      res.status(200).json({
        success: true,
        orderId: order.id,
        currency: order.currency,
        amount: order.amount,
      });
    } catch (error) {
      console.error('Order creation error:', error); 
      res.status(500).json({ success: false, message: 'Order creation failed', error: error.message });
    }
  };


exports.paymentAdd = catchAsync(async (req, res) => {
    console.log("req",req?.body)
    const { order_id, payment_id, amount ,currency, payment_status} = req.body;
    const payment = new Payment({
        order_id: order_id,
        currency:currency,
        payment_id:payment_id,
        amount,
        payment_status,
        status: 'success', 
    });
    await payment.save();
    res.status(200).json({ status: 'success', message: 'Payment verified and saved successfully' });
});



exports.PaymentGet = catchAsync(async (req, res, next) => {
  try {
    const payments = await Payment.find();
    console.log("Payments retrieved:", payments);
    res.status(200).json({
      status: true,
      message: "Payments retrieved successfully!",
      data: payments,
    });
  } catch (err) {
    console.error("Error retrieving payments:", err.message); 
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
      error: err.message, 
    });
  }
});

