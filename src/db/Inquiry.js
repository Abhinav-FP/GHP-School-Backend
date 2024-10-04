const mongoose = require("mongoose")

const InquirySchema = mongoose.Schema({
  srNo: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,

  },
})
module.exports = mongoose.model("Inquiry", InquirySchema)