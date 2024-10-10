const mongoose = require("mongoose")

const sportschema = mongoose.Schema({
    image: {
    type: String,
  },
  imagehash: {
    type: String,
  },
})
module.exports = mongoose.model("Sport",sportschema)