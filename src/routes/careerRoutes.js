const router =  require("express").Router();

const { verifyToken } = require("../controller/AuthController");
const { VacancyAdd, VacancyDelete, VacancyGet, CareerApply, CareerGet } = require("../controller/CareerController");

router.post("/vacancy/add",verifyToken, VacancyAdd);
router.post("/vacancy/delete",verifyToken, VacancyDelete);
router.get("/vacancy/get", VacancyGet);
router.post("/apply", CareerApply);
router.get("/apply/get", CareerGet);

module.exports= router;