const router =  require("express").Router();

const { VacancyAdd, VacancyDelete } = require("../controller/CareerController");

router.post("/vacancy/add", VacancyAdd);
router.post("/vacancy/delete", VacancyDelete);

module.exports= router;