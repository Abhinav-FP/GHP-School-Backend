const mongoose = require("mongoose")

const gallerychema = mongoose.Schema({
    heading: {
    type: String,
  },
  photos: {
    type: String, // Array of image file names
  },
})
module.exports = mongoose.model("Gallery",gallerychema)