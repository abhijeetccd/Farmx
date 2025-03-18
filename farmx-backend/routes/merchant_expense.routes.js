const router = require("express").Router();
const merchantExpenseController = require("../controllers/merchant_expense.controller");

// Create a new expense
router.post("/", merchantExpenseController.create);

// Get expenses for merchant and date
router.get(
  "/merchant/:merchantId/date/:date",
  merchantExpenseController.getByMerchantAndDate
);

// Update an expense
router.put("/:id", merchantExpenseController.update);

// Delete an expense
router.delete("/:id", merchantExpenseController.delete);

module.exports = router;
