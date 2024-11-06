const { verifyToken } = require("../controller/AuthController");
const { feesAdd, feesGet, feesDelete, feesEdit, InstagramApi } = require("../controller/FeesController");

const router =  require("express").Router();


router.post("/add", verifyToken, feesAdd);
router.get("/get", feesGet);
router.post("/delete", verifyToken, feesDelete); 
router.post("/edit", verifyToken, feesEdit);


module.exports= router;