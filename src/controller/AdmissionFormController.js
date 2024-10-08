const catchAsync = require("../utils/catchAsync");
const AdmissionForm = require("../db/AdmissionForm");

exports.formAdd = catchAsync(async (req, res, next) => {
  try {
    const {
      class: className,
      optional,
      date,
      aadhar,
      scholar,
      name,
      dobWords,
      type,
      dob,
      fatherName,
      fatherOccupation,
      fatherPhone,
      motherName,
      motherOccupation,
      motherPhone,
      guardianName,
      guardianOccupation,
      guardianPhone,
      fatheremail,
      email,
      address,
      school,
      class_percentage,
      sibling,
      belongs,
      facility,
    } = req.body;
    const newAdmission = new AdmissionForm({
      class: className,
      optional,
      date,
      aadhar,
      scholar,
      name,
      dobWords,
      type,
      dob,
      fatherName,
      fatherOccupation,
      fatherPhone,
      motherName,
      motherOccupation,
      motherPhone,
      guardianName,
      guardianOccupation,
      guardianPhone,
      fatheremail,
      email,
      address,
      school,
      class_percentage,
      sibling,
      belongs,
      facility,
    });
    await newAdmission.save();
    return res.status(201).json({
      status: true,
      message: "Admission form submitted successfully.",
      data: newAdmission,
    });
  } catch (error) {
    console.error("Error saving admission form:", error);
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});
