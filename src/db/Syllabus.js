const mongoose = require("mongoose")

const syllabusschema = mongoose.Schema({
    srNo: {
        type: Number,
      },
      text: {
          type: String,
        },
        link: {
        type: String,
      },
})
module.exports = mongoose.model("Syllabus",syllabusschema)