const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Faculty = require('../db/Faculty'); 

exports.facultyAdd = catchAsync(async (req, res, next) => {
    try {
        const { name, subjects, grades } = req.body;
        if (!name || !subjects || !grades) {
            return res.status(400).json({
                status: false,
                message: "All fields are required!",
            });
        }
        const lastFaculty = await Faculty.findOne().sort({ srNo: -1 });
        const srNo = lastFaculty ? lastFaculty.srNo + 1 : 1;
        const newFaculty = new Faculty({
            srNo,
            name,
            subjects,
            grades
        });
        await newFaculty.save();
        res.status(201).json({
            status: 'success',
            data: {
                faculty: newFaculty
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});


exports.facultyGet = catchAsync(async (req, res, next) => {
    try{
    const faculties = await Faculty.find().sort({ srNo: 1 });
      if (!faculties || faculties.length === 0) {
        return res.status(204).json({
          status: false,
          message: "No tasks found for this user.",
          faculties:[]
        });
      }
      res.status(200).json({
        status: true,
        message: "Tasks retrieved successfully!",
        faculties: faculties,
      });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "An unknown error occurred. Please try again later.",
        });
    }
});

exports.facultyDelete = catchAsync(async (req, res, next) => {
    try {
      const { srNo } = req.body;
      if (!srNo) {
        return res.status(400).json({
          status: false,
          message: "Faculty number (srNo) is required",
        });
      }
      const deletedFaculty = await Faculty.findOneAndDelete({ srNo });
      if (!deletedFaculty) {
        return res.status(404).json({
          status: false,
          message: `No faculty found with srNo: ${srNo}`,
        });
      }
      const facultiesToUpdate = await Faculty.find({ srNo: { $gt: srNo } });
      if (facultiesToUpdate.length > 0) {
        await Faculty.updateMany(
          { srNo: { $gt: srNo } }, 
          { $inc: { srNo: -1 } }   
        );
      }
      return res.status(200).json({
        status: true,
        message: `Faculty deleted successfully`,
        deletedFaculty:deletedFaculty,
      });
  
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later.",
      });
    }
  });

