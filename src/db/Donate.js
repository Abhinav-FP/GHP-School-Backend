const mongoose = require("mongoose")

const donateSchema = mongoose.Schema({
    srNo: {
        type: Number,
      },
    name: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  photo: {
    type: String,
  },
  imagehash: {
    type: String,
  },
})
module.exports = mongoose.model("Donate",donateSchema)