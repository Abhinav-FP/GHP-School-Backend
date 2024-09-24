const mongoose = require("mongoose");

const vacancyschema = mongoose.Schema({
  designation: {
    type: String,
  },
  description: {
    type: String,
  },
  experience: {
    type: String,
  },
  qualification: {
    type: String,
  },
  uuid: {
    type: String,
  },
});
module.exports = mongoose.model("Vacancy", vacancyschema);
