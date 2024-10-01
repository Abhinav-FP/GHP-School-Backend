const router =  require("express").Router();
const { galleryGet, galleryGetId } = require("../controller/GalleryController");

router.get("/gallery/get", galleryGet);
router.get("/gallery/get/:uuid", galleryGetId);

module.exports= router;