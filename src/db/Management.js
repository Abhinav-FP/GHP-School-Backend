const mongoose = require("mongoose")

const managementschema = mongoose.Schema({
    srNo: {
        type: Number,
      },
      type:{
        type: String,
      },
    name: {
    type: String,
  },
  photo: {
    type: String,
  },
  text: {
    type: String,
  },
})
module.exports = mongoose.model("Management",managementschema)