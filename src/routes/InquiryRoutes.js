const router = require("express").Router();
const { verifyToken } = require("../controller/AuthController");
const { InquiryAdd, InquiryDelete, InquiryGet } = require("../controller/InquiryController");

router.post("/add", InquiryAdd);

router.post("/delete", verifyToken, InquiryDelete);

router.get("/get", InquiryGet);

module.exports = router;