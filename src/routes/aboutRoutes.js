const router =  require("express").Router();

const {facultyAdd, facultyGet, facultyDelete} = require("../controller/AboutController")


router.post("/faculty/add", facultyAdd);
router.get("/faculty/get", facultyGet);
router.post("/faculty/delete", facultyDelete);

module.exports= router;