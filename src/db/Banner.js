const mongoose = require("mongoose")

const bannerschema = mongoose.Schema({
    srNo: {
        type: Number,
      },
    heading: {
    type: String,
  },
  text: {
    type: String,
  },
  photo: {
    type: String,
  },
})
module.exports = mongoose.model("Banner",bannerschema)