const router =  require("express").Router();
const { verifyToken } = require("../controller/AuthController");
const { galleryGet, galleryGetCategory, galleryDeleteById, galleryDeleteByCategory } = require("../controller/GalleryController");

router.get("/gallery/get", galleryGet);
router.get("/gallery/get/:type", galleryGetCategory);
router.post("/gallery/delete/:id", verifyToken, galleryDeleteById);

module.exports= router;