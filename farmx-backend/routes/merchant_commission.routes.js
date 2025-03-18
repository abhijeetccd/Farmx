const express = require("express");
const router = express.Router();
const merchantCommissionController = require("../controllers/merchant_commission.controller");

router.post("/", merchantCommissionController.create);
router.put("/:id", merchantCommissionController.update);
router.get(
  "/merchant/:vendor_id/date/:date",
  merchantCommissionController.findByMerchantAndDate
);

module.exports = router;
