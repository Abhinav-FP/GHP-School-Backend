const mongoose = require("mongoose");

const donationUserschema = mongoose.Schema({
  srNo: {
    type: Number,
  },
  name: {
    type: String,
  },
  number: {
    type: Number,
  },
  aadhar: {
    type: String,
  },
  pan: {
    type: String,
  },
  email: {
    type: String,
  },
  amount: {
    type: Number,
  },
  payment_id: {
    type: String,
  },
  link:{
    type: String,
  },
  panNumber:{
    type: String,
  }
});
module.exports = mongoose.model("DonationUser", donationUserschema);
