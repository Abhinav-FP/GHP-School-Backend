const { feesAdd, feesGet, feesDelete, feesEdit } = require("../controller/FeesController");

const router =  require("express").Router();


router.post("/add", feesAdd);
router.get("/get", feesGet);
router.post("/delete", feesDelete); 
router.post("/edit", feesEdit); 


module.exports= router;