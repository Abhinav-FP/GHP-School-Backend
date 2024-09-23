const mongoose = require("mongoose")

const facultyschema = mongoose.Schema({
    srNo: {
        type: Number,
        unique:[true, 'ID is already taken.'], 
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