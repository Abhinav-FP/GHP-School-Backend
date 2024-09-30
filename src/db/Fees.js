const mongoose = require("mongoose");

const feesschema = mongoose.Schema({
  srNo: {
    type: Number,
  },
  grade: {
    type: String,
  },
  first: {
    type: Number,
  },
  second: {
    type: Number,
  },
  third: {
    type: Number,
  },
  fourth: {
    type: Number,
  },
  total: {
    type: Number,
  },
});
module.exports = mongoose.model("Fees", feesschema);
