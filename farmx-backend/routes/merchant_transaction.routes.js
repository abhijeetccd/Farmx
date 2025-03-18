const router = require("express").Router();
const merchantTransactions = require("../controllers/merchant_transaction.controller");

// Create a new merchant transaction
router.post("/", merchantTransactions.create);

// Get all merchant transactions with filters
router.get("/", merchantTransactions.findAll);

// Get merchant transaction by ID
router.get("/:id", merchantTransactions.findOne);

// Update merchant transaction
router.put("/:id", merchantTransactions.update);

// Delete merchant transaction
router.delete("/:id", merchantTransactions.delete);

// Get merchant transactions by transaction ID
router.get(
  "/by-transaction/:transactionId",
  merchantTransactions.findByTransactionId
);

module.exports = router;
