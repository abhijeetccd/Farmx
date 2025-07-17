const { Transaction, Vendor, MerchantTransaction } = require("../models");
const { Op } = require("sequelize");

// Create a new transaction
exports.create = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Error occurred while creating transaction.",
    });
  }
};

// Get all transactions
exports.findAll = async (req, res) => {
  try {
    const { vendor_id, start_date, end_date, vendor_type } = req.query;
    const where = {};
    const vendorWhere = {};

    // Filter by vendor_type if provided (moved to vendor include)
    if (vendor_type) {
      vendorWhere.type = vendor_type;
    }

    // Filter by vendor_id if provided
    if (vendor_id) {
      where.vendor_id = vendor_id;
    }

    // Filter by date range
    if (start_date || end_date) {
      where.date = {};
      if (start_date) {
        const startDateTime = new Date(start_date);
        startDateTime.setHours(0, 0, 0, 0);
        where.date[Op.gte] = startDateTime;
      }
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.date[Op.lte] = endDateTime;
      }
    } else {
      // If no date range provided, show today's data by default
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      where.date = {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      };
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: Vendor,
          as: "vendor",
          attributes: ["id", "name", "phone_no", "account_no", "address"],
          where: vendorWhere,
        },
        {
          model: Vendor,
          as: "merchant",
          attributes: ["id", "name", "phone_no"],
          required: false,
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json(transactions);
  } catch (err) {
    console.error("Error in findAll:", err);
    res.status(500).json({
      message: err.message || "Error occurred while retrieving transactions.",
    });
  }
};

// Get transaction by ID
exports.findOne = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        {
          model: Vendor,
          as: "vendor",
          attributes: ["name", "type", "phone_no", "address"],
        },
      ],
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error occurred while retrieving transaction.",
    });
  }
};

// Update transaction
exports.update = async (req, res) => {
  try {
    const [updated] = await Transaction.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // If merchant_vendor_id is being set to null, delete associated merchant transaction
    if (req.body.merchant_vendor_id === null) {
      await MerchantTransaction.destroy({
        where: { transaction_id: req.params.id },
      });
    }

    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        {
          model: Vendor,
          as: "vendor",
          attributes: ["id", "name", "phone_no"],
        },
        {
          model: Vendor,
          as: "merchant",
          attributes: ["id", "name", "phone_no"],
        },
      ],
    });
    res.json(transaction);
  } catch (error) {
    console.error("Error in update:", error);
    res.status(400).json({
      message: error.message || "Error occurred while updating transaction.",
    });
  }
};

// Delete transaction
exports.delete = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error occurred while deleting transaction.",
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment_status } = req.body;
    const [updated] = await Transaction.update(
      { payment_status },
      {
        where: { id: req.params.id },
      }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const transaction = await Transaction.findByPk(req.params.id);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Error occurred while updating payment status.",
    });
  }
};

// Add this new method to the existing controller
exports.getPendingAmount = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const amount = await Transaction.sum("final_amount", {
      where: {
        vendor_id: vendorId,
        payment_status: "pending",
      },
    });

    res.json({ amount: amount || 0 });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Error occurred while calculating pending amount.",
    });
  }
};
