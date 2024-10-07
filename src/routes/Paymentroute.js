const router = require("express").Router();
const { paymentAdd, createOrder } = require("../controller/PaymentController");

router.post("/verify-payment", paymentAdd);
router.post("/create", createOrder);



module.exports = router;