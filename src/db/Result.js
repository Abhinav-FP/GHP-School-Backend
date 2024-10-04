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
  stream: {
    type: String,
  },
  photo: {
    type: String,
  },
  imagehash: {
    type: String,
  },
  percentage: {
    type: Number,
  },
});
module.exports = mongoose.model("Result", resultschema);