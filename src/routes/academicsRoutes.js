const { syllabusAdd, syllabusGet } = require("../controller/SyllabusController");

const router =  require("express").Router();

router.post("/syllabus/add", syllabusAdd);
router.get("/syllabus/get", syllabusGet);
// router.get("/director/get", directorGet);

module.exports= router;