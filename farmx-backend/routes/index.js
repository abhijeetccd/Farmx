const express = require("express");
const router = express.Router();
const vendorRoutes = require("./vendor.routes");
const transactionRoutes = require("./transaction.routes");
const merchantTransactionRoutes = require("./merchant_transaction.routes");
const merchantExpenseRoutes = require("./merchant_expense.routes");
const dashboardRoutes = require("./dashboard.routes");
const merchantPaymentRoutes = require("./merchant_payment.routes");
const merchantCommissionRoutes = require("./merchant_commission.routes");

router.use("/vendors", vendorRoutes);
router.use("/transactions", transactionRoutes);
router.use("/merchant-transactions", merchantTransactionRoutes);
router.use("/merchant-expenses", merchantExpenseRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/merchant-payments", merchantPaymentRoutes);
router.use("/merchant-commissions", merchantCommissionRoutes);

module.exports = router;
