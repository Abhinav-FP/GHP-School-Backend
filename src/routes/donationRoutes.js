const router =  require("express").Router();
const { DonateAdd, DonateGet, DonateDelete } = require("../controller/DonateController");

router.post("/add", DonateAdd);
router.get("/get/:srNo?", DonateGet);
router.post("/delete", DonateDelete);

module.exports= router;