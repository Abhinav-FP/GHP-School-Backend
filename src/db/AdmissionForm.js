const mongoose = require("mongoose");

const admissionformSchema = new mongoose.Schema({
  class: {
    type: String,
  },
  optional: {
    type: String,
  },
  date: {
    type: Date,
  },
  aadhar: {
    type: String,
  },
  scholar: {
    type: String,
  },
  name: {
    type: String,
    required: true, 
  },
  dobWords: {
    type: String,
  },
  type: {
    type: String,
  },
  dob: {
    type: Date,
  },
  fatherName: {
    type: String,
  },
  fatherOccupation: {
    type: String,
  },
  fatherPhone: {
    type: String,
  },
  motherName: {
    type: String,
  },
  motherOccupation: {
    type: String,
  },
  motherPhone: {
    type: String,
  },
  guardianName: {
    type: String,
  },
  guardianOccupation: {
    type: String,
  },
  guardianPhone: {
    type: String,
  },
  fatheremail: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  school: {
    type: String,
  },
  class_percentage: {
    type: String,
  },
  sibling: {
    type: String,
  },
  belongs: {
    type: String,
  },
  facility: {
    type: String,
  },
  payment_id: {
    type: String,
  },
  order_id: {
    type: String,
  },
  amount: {
    type: String,
  },
  image: {
    type: String,
  }, 
  birth: {
    type: String,
  },
  additional: {
    type: String,
  },
}, { timestamps: true }); 

// Create a model from the schema
module.exports = mongoose.model("AdmissionForm",admissionformSchema)

