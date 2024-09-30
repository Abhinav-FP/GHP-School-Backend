const router =  require("express").Router();
const { galleryAdd } = require("../controller/GalleryController");
const upload = require("../utils/uploadConfig");

router.post("/gallery/add", upload.array('photos'), galleryAdd);

module.exports= router;