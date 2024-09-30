const mongoose = require("mongoose");

const admissionschema = mongoose.Schema({
  show: {
    type: Boolean,
  },
  text: {
    type: String,
  },
});

module.exports = mongoose.model("Admission", admissionschema);

