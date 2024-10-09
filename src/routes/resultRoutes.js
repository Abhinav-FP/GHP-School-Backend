const router =  require("express").Router();
const { verifyToken } = require("../controller/AuthController");
const { resultAdd, resultGet, resultDelete } = require("../controller/ResultController");
// const upload = require("../utils/uploadConfig");

// router.post("/add", upload.single('photo'), resultAdd);
router.get("/get", resultGet);
router.post("/delete", verifyToken, resultDelete);

module.exports= router;