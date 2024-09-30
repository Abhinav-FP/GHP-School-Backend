const router =  require("express").Router();
const { AdmissionLineAdd, AdmissionLineShow, AdmissionLineText, AdmissionGet } = require("../controller/AdmissionController");
const { bannerAdd, bannerGet, bannerDelete, bannerMove } = require("../controller/BannerController");
const upload = require("../utils/uploadConfig");




// router.post("/banner/add", upload.single('photo'), bannerAdd);
router.get("/banner/get", bannerGet);
router.post("/banner/delete", bannerDelete);
router.post("/banner/move", bannerMove);
// Admission line
router.post("/admission/show", AdmissionLineShow);
router.post("/admission/add", AdmissionLineAdd);
router.post("/admission/text", AdmissionLineText);
router.get("/admission/get", AdmissionGet);


module.exports= router;