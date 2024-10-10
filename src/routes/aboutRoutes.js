const router =  require("express").Router();

const { verifyToken } = require("../controller/AuthController");
const { ComingSoonAdd, ComingSoonGet, ComingSoonEdit, ComingSoonShow } = require("../controller/ComingSoonController");
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
router.post("/comingsoon/add", ComingSoonAdd);
router.get("/comingsoon/get", ComingSoonGet);
router.post("/comingsoon/edit", verifyToken, ComingSoonEdit);
router.post("/comingsoon/show", verifyToken, ComingSoonShow);

module.exports= router;