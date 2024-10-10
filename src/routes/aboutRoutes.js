const router =  require("express").Router();

const { verifyToken } = require("../controller/AuthController");
const { directorAdd, directorGet, directorEdit } = require("../controller/DirectorController");
const {facultyAdd, facultyGet, facultyDelete, facultyMove} = require("../controller/FacultyController");
const { principalGet, principalAdd, principalEdit } = require("../controller/PrincipalController");
const { schoolDelete, schoolGet, schoolAdd } = require("../controller/SisterSchoolController");


router.post("/faculty/add", verifyToken, facultyAdd);
router.get("/faculty/get", facultyGet);
router.post("/faculty/delete", verifyToken ,facultyDelete);
router.post("/faculty/move", verifyToken, facultyMove);
router.get("/principal/get", principalGet);
router.get("/director/get", directorGet);
router.post("/sisterschool/add", verifyToken, schoolAdd);
router.get("/sisterschool/get", schoolGet);
router.post("/sisterschool/delete", verifyToken, schoolDelete);

module.exports= router;