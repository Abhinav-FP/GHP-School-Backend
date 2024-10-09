const { verifyToken } = require("../controller/AuthController");
const { syllabusAdd, syllabusGet, syllabusDelete } = require("../controller/SyllabusController");

const router =  require("express").Router();

router.post("/syllabus/add", verifyToken, syllabusAdd);
router.get("/syllabus/get", syllabusGet);
router.post("/syllabus/delete", syllabusDelete);

module.exports= router;