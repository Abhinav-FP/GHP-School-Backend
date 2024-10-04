const router = require("express").Router();
const { InquiryAdd, InquiryDelete, InquiryGet } = require("../controller/InquiryController");

router.post("/add", InquiryAdd);

router.post("/delete", InquiryDelete);

router.get("/get", InquiryGet);

module.exports = router;