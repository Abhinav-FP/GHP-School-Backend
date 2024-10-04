const router =  require("express").Router();
const { DonateAdd } = require("../controller/DonateController");

router.post("/added", DonateAdd);
// router.get("/get", galleryGet);
// router.post("/get/:id", galleryDeleteById);
// router.delete("/delete", galleryGetCategory);

module.exports= router;