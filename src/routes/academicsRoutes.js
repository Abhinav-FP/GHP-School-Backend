const { verifyToken } = require("../controller/AuthController");
const { NotificationAdd, NotificationGet, NotificationUpdate, NotificationDelete, CalendarGet, CalendarAdd, CalendarUpdate } = require("../controller/NotificationController");
const { syllabusAdd, syllabusGet, syllabusDelete, syllabusUpdate } = require("../controller/SyllabusController");

const router =  require("express").Router();

router.post("/syllabus/add", verifyToken, syllabusAdd);
router.get("/syllabus/get", syllabusGet);
router.post("/syllabus/delete", syllabusDelete);
router.post("/syllabus/edit", syllabusUpdate);


// NotificationGet
router.post("/notification/add", verifyToken, NotificationAdd);
router.get("/notification/get", NotificationGet);
router.post("/notification/delete", NotificationDelete);
router.post("/notification/edit", NotificationUpdate);


// AcademicsRoutes


router.get("/calendar/get", CalendarGet);
router.post("/calendar/add", verifyToken, CalendarAdd);
router.post("/calendar/edit", verifyToken, CalendarUpdate);

module.exports= router;