const mongoose = require("mongoose")

const donationschema = mongoose.Schema({
    srNo: {
        type: Number,
      },
    amount: {
        type: Number,
      },
    name: {
    type: String,
  },
  description: {
    type: String,
  },
  photo: {
    type: String,
  },
})
module.exports = mongoose.model("Donation",donationschema)