const mongoose = require("mongoose");

const applicationschema = mongoose.Schema({
    name: {
    type: String,
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
  },
  position: {
    type: String,
  },
  experience: {
    type: String,
  },
  resume: {
    type: String,
  },
  about: {
    type: String,
  },
  uuid: {
    type: String,
  },
});
module.exports = mongoose.model("Application", applicationschema);
