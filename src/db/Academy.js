const mongoose = require("mongoose")

const AcademyLink = mongoose.Schema({
        link: {
        type: String,
      },
      viewLink :{
        type: String,
      },
})
module.exports = mongoose.model("Academy",AcademyLink)