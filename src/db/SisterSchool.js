const mongoose = require("mongoose")

const schoolschema = mongoose.Schema({
    image: {
    type: String,
  },
  imagehash: {
    type: String,
  },
})
module.exports = mongoose.model("SisterSchool",schoolschema)