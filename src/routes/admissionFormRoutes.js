const { formAdd } = require("../controller/AdmissionFormController");
const { verifyToken } = require("../controller/AuthController");

const router =  require("express").Router();

router.post("/add", formAdd);
// router.get("/get", verifyToken, facultyGet);

module.exports= router;