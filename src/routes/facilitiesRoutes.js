const router =  require("express").Router();
const { verifyToken } = require("../controller/AuthController");
const { galleryGet, galleryGetCategory, galleryDeleteById, galleryDeleteByCategory, sportsAdd, sportsGet, sportsDelete } = require("../controller/GalleryController");

router.get("/gallery/get", galleryGet);
router.get("/gallery/get/:type", galleryGetCategory);
router.post("/gallery/delete/:id", verifyToken, galleryDeleteById);
router.post("/sports/add", verifyToken, sportsAdd);
router.get("/sports/get", sportsGet);
router.post("/sports/delete", verifyToken, sportsDelete);

module.exports= router;