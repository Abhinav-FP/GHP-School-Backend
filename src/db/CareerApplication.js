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
  other_position :{
    type: String,
    default: null
  }
});
module.exports = mongoose.model("Application", applicationschema);
