const router = require("express").Router();
const { paymentAdd } = require("../controller/PaymentController");

router.post("/verify-payment", paymentAdd);


module.exports = router;