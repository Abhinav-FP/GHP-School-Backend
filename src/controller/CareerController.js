const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { v4: uuidv4 } = require('uuid');
const Vacancy = require("../db/Vacancy");

exports.VacancyAdd = catchAsync(async (req, res, next) => {
  try {
    const { designation, description, experience, qualification } = req.body;
    if (!designation || !description || !experience || !qualification) {
      return res.status(400).json({
        status: false,
        message: "All fields are required!",
      });
    }
    const UUID = uuidv4();
    const newVacancy = new Vacancy({
        uuid:UUID,
        designation, 
        description, 
        experience, 
        qualification
    });
    await newVacancy.save();
    res.status(201).json({
      status: "success",
      message: "Vacancy Created Successfully!",
      data: {
        Vacancy: newVacancy,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An unknown error occurred. Please try again later.",
    });
  }
});

exports.VacancyDelete = catchAsync(async (req, res, next) => {
    try {
      const { uuid } = req.body;
      if (!uuid) {
        return res.status(400).json({
          status: false,
          message: "All fields are required!",
        });
      }
      const deletedVacancy = await Vacancy.findOneAndDelete({ uuid:uuid });
    if (!deletedVacancy) {
      return res.status(404).json({
        status: false,
        message: `No faculty found with given uuid: ${uuid}`,
      });
    }
    return res.status(200).json({
      status: true,
      message: `Vacancy deleted successfully`,
      deletedVacancy: deletedVacancy,
    });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later.",
      });
    }
  });

  exports.VacancyGet = catchAsync(async (req, res, next) => {
    try {
      const data = await Vacancy.find();
      if (!data || data.length === 0) {
        return res.status(204).json({
          status: false,
          message: "No data found",
          data: [],
        });
      }
      res.status(200).json({
        status: true,
        message: "Vacancies retrieved successfully!",
        data: data,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "An unknown error occurred. Please try again later.",
      });
    }
  });