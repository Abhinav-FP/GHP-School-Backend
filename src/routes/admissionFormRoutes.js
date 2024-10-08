const { formAdd, formGet } = require("../controller/AdmissionFormController");
const { verifyToken } = require("../controller/AuthController");

const router =  require("express").Router();

router.post("/add", formAdd);
router.get("/get", verifyToken, formGet);

module.exports= router;