const mongoose = require("mongoose")

const gallerychema = mongoose.Schema({
    heading: {
    type: String,
  },
  images: {
    type: String, // Array of image file names
  },
})
module.exports = mongoose.model("Gallery",gallerychema)