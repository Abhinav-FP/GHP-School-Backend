const router =  require("express").Router();
const { AdmissionLineAdd, AdmissionLineShow, AdmissionLineText, AdmissionGet } = require("../controller/AdmissionController");
const { verifyToken } = require("../controller/AuthController");
const { bannerAdd, bannerGet, bannerDelete, bannerMove } = require("../controller/BannerController");
// const upload = require("../utils/uploadConfig");




// router.post("/banner/add", upload.single('photo'), bannerAdd);
router.get("/banner/get", bannerGet);
router.post("/banner/delete", verifyToken, bannerDelete);
router.post("/banner/move",verifyToken, bannerMove);
// Admission line
router.post("/admission/show", verifyToken, AdmissionLineShow);
router.post("/admission/add", verifyToken, AdmissionLineAdd);
router.post("/admission/text", verifyToken, AdmissionLineText);
router.get("/admission/get", AdmissionGet);


module.exports= router;