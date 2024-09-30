const router =  require("express").Router();
const { resultAdd, resultGet, resultDelete } = require("../controller/ResultController");
const upload = require("../utils/uploadConfig");

router.post("/add", upload.single('photo'), resultAdd);
router.get("/get/:grade", upload.single('photo'), resultGet);
router.post("/delete", upload.single('photo'), resultDelete);

module.exports= router;