const router = require("express").Router();
const { paymentAdd, createOrder, PaymentGet } = require("../controller/PaymentController");

router.post("/verify-payment", paymentAdd);
router.post("/create", createOrder);
router.get("/create", PaymentGet);




module.exports = router;