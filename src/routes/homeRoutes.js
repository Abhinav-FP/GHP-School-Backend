const router =  require("express").Router();
const { bannerAdd, bannerGet, bannerDelete, bannerMove } = require("../controller/BannerController");
const upload = require("../utils/uploadConfig");

router.post("/banner/add", upload.single('photo'), bannerAdd);
router.get("/banner/get", bannerGet);
router.post("/banner/delete", bannerDelete);
router.post("/banner/move", bannerMove);
// Admission line


module.exports= router;