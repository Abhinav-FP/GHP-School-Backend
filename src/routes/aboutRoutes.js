const router =  require("express").Router();

const {facultyAdd, facultyGet, facultyDelete, facultyMove} = require("../controller/FacultyController")


router.post("/faculty/add", facultyAdd);
router.get("/faculty/get", facultyGet);
router.post("/faculty/delete", facultyDelete);
router.post("/faculty/move", facultyMove);

module.exports= router;