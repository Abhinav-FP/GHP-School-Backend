const router =  require("express").Router();

const { VacancyAdd, VacancyDelete, VacancyGet } = require("../controller/CareerController");

router.post("/vacancy/add", VacancyAdd);
router.post("/vacancy/delete", VacancyDelete);
router.get("/vacancy/get", VacancyGet);

module.exports= router;