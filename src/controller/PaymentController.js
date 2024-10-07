const Payment = require("../db/Payment");
const catchAsync = require("../utils/catchAsync");
const Razorpay = require('razorpay');
require('dotenv').config(); 


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  exports.createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body; // Set default currency to INR
  
    try {
      // Create options for the order
      const options = {
        amount: amount * 100, // Convert amount to paise
        currency,
        receipt, // Optional: you can include a receipt if needed
        payment_capture: 1, // Auto capture payment
      };
  
      // Create the order
      const order = await razorpayInstance.orders.create(options);
  
      // Return the order details to the client
      res.status(200).json({
        success: true,
        orderId: order.id,
        currency: order.currency,
        amount: order.amount,
      });
    } catch (error) {
      console.error('Order creation error:', error); // Log the error for debugging
      res.status(500).json({ success: false, message: 'Order creation failed', error: error.message });
    }
  };


exports.paymentAdd = catchAsync(async (req, res) => {
    console.log("req",req?.body)
    const { order_id, payment_id, amount ,currency} = req.body;
    const payment = new Payment({
        order_id: order_id,
        currency:currency,
        payment_id:payment_id,
        amount,
        status: 'success', 
    });
    await payment.save();
    res.status(200).json({ status: 'success', message: 'Payment verified and saved successfully' });
});



exports.PaymentGet = catchAsync(async (req, res, next) => {
  try {
    const Payment = await Payment.find().sort({ srNo: 1 });
    if (!Payment || Payment.length === 0) {
      return res.status(204).json({
        status: false,
        message: "No Payment found for this user.",
        Payment: [],
      });
    }
    res.status(200).json({
      status: true,
      message: "Payment retrieved successfully!",
      Payment: Payment,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});
