const mongoose = require("mongoose")

const gallerychema = mongoose.Schema({
    caption: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    name: {
      type: String,
    },
    url: {
      type: String, // Array of image file names
    },
    fileSize: {
      type: String, // Array of image file names
    }, 
    createdAt: {
      type: Date,
      default : Date.now()
    },
    updatedAt: {
      type: Date,
    },
})
module.exports = mongoose.model("Gallery",gallerychema)