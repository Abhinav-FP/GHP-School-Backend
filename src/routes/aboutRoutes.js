const router =  require("express").Router();

const { directorAdd, directorGet } = require("../controller/DirectorController");
const {facultyAdd, facultyGet, facultyDelete, facultyMove} = require("../controller/FacultyController");
const { principalGet, principalAdd } = require("../controller/PrincipalController");
const upload = require("../utils/uploadConfig");


router.post("/faculty/add", facultyAdd);
router.get("/faculty/get", facultyGet);
router.post("/faculty/delete", facultyDelete);
router.post("/faculty/move", facultyMove);
// Principal apis
router.post("/principal/add", upload.single('photo'), principalAdd);
router.get("/principal/get", principalGet);
// Director apis
router.post("/director/add", upload.single('photo'), directorAdd);
router.get("/director/get", directorGet);

module.exports= router;