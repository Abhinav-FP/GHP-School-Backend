const mongoose = require("mongoose")

const userschema = mongoose.Schema({
  email: {
    type: String,
    unique:[true, 'Username is already taken.'], 
  },
  password: {
    type:String,
    select:false
  },
})
module.exports = mongoose.model("user",userschema)