const router =  require("express").Router();
const { resultAdd, resultGet, resultDelete } = require("../controller/ResultController");
// const upload = require("../utils/uploadConfig");

// router.post("/add", upload.single('photo'), resultAdd);
router.get("/get", resultGet);
router.post("/delete", resultDelete);

module.exports= router;