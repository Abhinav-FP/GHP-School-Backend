const { directorGet } = require("../controller/DirectorController");
const { facultyMove } = require("../controller/FacultyController");
const { principalGet } = require("../controller/PrincipalController");

const router =  require("express").Router();

router.post("/syllabus/add", facultyMove);
router.get("/syllabus/get", principalGet);
router.get("/director/get", directorGet);

module.exports= router;