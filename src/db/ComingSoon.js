const mongoose = require("mongoose")

const comingsoonschema = mongoose.Schema({
    image: {
        type: String,
      },
    imagehash: {
    type: String,
  },
  text1: {
    type: String,
  },
  text2: {
    type: String,
  },
  show: {
    type: Boolean,
  },
})
module.exports = mongoose.model("ComingSoon",comingsoonschema)