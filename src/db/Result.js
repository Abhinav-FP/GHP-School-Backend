const mongoose = require("mongoose");

const resultschema = mongoose.Schema({
  rollNo: {
    type: Number,
  },
  name: {
    type: String,
  },
  grade: {
    type: String,
  },
  photo: {
    type: String,
  },
  percentage: {
    type: Number,
  },
});
module.exports = mongoose.model("Result", resultschema);