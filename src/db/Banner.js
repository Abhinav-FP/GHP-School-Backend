const mongoose = require("mongoose")

const bannerschema = mongoose.Schema({
    srNo: {
        type: Number,
      },
  photo: {
    type: String,
  },
  imagehash: {
    type: String,
  },
})
module.exports = mongoose.model("Banner",bannerschema)