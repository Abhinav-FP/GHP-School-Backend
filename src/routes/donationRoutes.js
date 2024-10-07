const router =  require("express").Router();
const { verifyToken } = require("../controller/AuthController");
const { DonateAdd, DonateGet, DonateDelete } = require("../controller/DonateController");

router.post("/add", verifyToken, DonateAdd);
router.get("/get/:srNo?", DonateGet);
router.post("/delete", verifyToken, DonateDelete);

module.exports= router;