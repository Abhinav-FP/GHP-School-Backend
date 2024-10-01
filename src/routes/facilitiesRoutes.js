const router =  require("express").Router();
const { galleryGet, galleryGetId, galleryDelete } = require("../controller/GalleryController");

router.get("/gallery/get", galleryGet);
router.get("/gallery/get/:uuid", galleryGetId);
router.post("/gallery/delete", galleryDelete);

module.exports= router;