const db = require("../models");
const MerchantExpense = db.MerchantExpense;
const Vendor = db.Vendor;

const merchantExpenseController = {
  // Create a new expense
  create: async (req, res) => {
    try {
      const { description, amount, date, vendor_id } = req.body;

      // Validate required fields
      if (!vendor_id || !date || !description || !amount) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const expense = await MerchantExpense.create({
        description,
        amount: parseFloat(amount),
        date,
        vendor_id: parseInt(vendor_id),
      });

      // Fetch the created expense with merchant details
      const expenseWithMerchant = await MerchantExpense.findByPk(expense.id, {
        include: [
          {
            model: Vendor,
            as: "merchant",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(201).json(expenseWithMerchant);
    } catch (err) {
      console.error("Error creating expense:", err);
      res.status(500).json({
        message: err.message || "Error occurred while creating expense.",
      });
    }
  },

  // Get all expenses for a merchant and date
  getByMerchantAndDate: async (req, res) => {
    try {
      const { merchantId, date } = req.params;

      const expenses = await MerchantExpense.findAll({
        where: {
          vendor_id: merchantId,
          date,
        },
        include: [
          {
            model: Vendor,
            as: "merchant",
            attributes: ["id", "name"],
          },
        ],
        order: [["created_at", "ASC"]],
      });

      res.json(expenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      res.status(500).json({
        message: err.message || "Error occurred while retrieving expenses.",
      });
    }
  },

  // Update an expense
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { description, amount } = req.body;

      const [updated] = await MerchantExpense.update(
        {
          description,
          amount: parseFloat(amount),
        },
        {
          where: { id },
        }
      );

      if (updated) {
        const expense = await MerchantExpense.findByPk(id, {
          include: [
            {
              model: Vendor,
              as: "merchant",
              attributes: ["id", "name"],
            },
          ],
        });
        res.json(expense);
      } else {
        res.status(404).json({ message: "Expense not found" });
      }
    } catch (err) {
      console.error("Error updating expense:", err);
      res.status(500).json({
        message: err.message || "Error occurred while updating expense.",
      });
    }
  },

  // Delete an expense
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await MerchantExpense.destroy({
        where: { id },
      });

      if (deleted) {
        res.json({ message: "Expense deleted successfully" });
      } else {
        res.status(404).json({ message: "Expense not found" });
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      res.status(500).json({
        message: err.message || "Error occurred while deleting expense.",
      });
    }
  },
};

module.exports = merchantExpenseController;
