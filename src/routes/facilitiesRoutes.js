const router =  require("express").Router();
const { galleryGet, galleryGetCategory, galleryDeleteById, galleryDeleteByCategory } = require("../controller/GalleryController");

router.get("/gallery/get", galleryGet);
router.get("/gallery/get/:type", galleryGetCategory);
router.post("/gallery/delete/:id", galleryDeleteById);

module.exports= router;