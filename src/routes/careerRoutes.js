const router =  require("express").Router();

const { VacancyAdd, VacancyDelete, VacancyGet, CareerApply, CareerGet } = require("../controller/CareerController");

router.post("/vacancy/add", VacancyAdd);
router.post("/vacancy/delete", VacancyDelete);
router.get("/vacancy/get", VacancyGet);
router.post("/apply", CareerApply);
router.get("/apply/get", CareerGet);

module.exports= router;