const router =  require("express").Router();
const { verifyToken } = require("../controller/AuthController");
const { DonateAdd, DonateGet, DonateDelete, DonateUserAdd, DonateInvoiceGet } = require("../controller/DonateController");
// const { DonateUserAddTest, PdfKit } = require("../controller/TestDonateController");


router.post("/add", verifyToken, DonateAdd);
router.get("/get/:srNo?", DonateGet);
router.post("/delete", verifyToken, DonateDelete);
router.post("/user/add", DonateUserAdd);
router.get("/invoice/get/:payment_id?", DonateInvoiceGet);
// router.post("/user/test-add", DonateUserAddTest);
// router.post("/pdf-kit", PdfKit);

module.exports= router;