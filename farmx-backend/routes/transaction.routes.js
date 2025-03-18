const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

// Create a new transaction
router.post("/", transactionController.create);

// Get all transactions
router.get("/", transactionController.findAll);

// Get transaction by id
router.get("/:id", transactionController.findOne);

// Update transaction
router.put("/:id", transactionController.update);

// Delete transaction
router.delete("/:id", transactionController.delete);

// Update payment status
router.patch("/:id/payment-status", transactionController.updatePaymentStatus);

// Add this new route
router.get("/pending-amount/:vendorId", transactionController.getPendingAmount);

module.exports = router;
