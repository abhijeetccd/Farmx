const express = require("express");
const router = express.Router();
const merchantPaymentController = require("../controllers/merchant_payment.controller");

router.post("/", merchantPaymentController.create);
router.put("/:id", merchantPaymentController.update);
router.delete("/:id", merchantPaymentController.delete);
router.get("/merchant/:merchantId", merchantPaymentController.getByMerchant);

module.exports = router;
