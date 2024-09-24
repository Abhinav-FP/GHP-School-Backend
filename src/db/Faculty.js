const mongoose = require("mongoose")

const facultyschema = mongoose.Schema({
    srNo: {
        type: Number,
      },
    name: {
    type: String,
  },
  subjects: {
    type: String,
  },
  grades: {
    type: String,
  },
})
module.exports = mongoose.model("Faculty",facultyschema)