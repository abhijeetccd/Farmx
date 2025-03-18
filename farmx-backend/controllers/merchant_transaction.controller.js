const { MerchantTransaction, Vendor, Transaction } = require("../models");
const { Op } = require("sequelize");

// Create a new merchant transaction
exports.create = async (req, res) => {
  try {
    console.log("Creating merchant transaction with data:", req.body);

    // Create the merchant transaction
    const merchantTransaction = await MerchantTransaction.create(req.body);

    // Fetch the created transaction with associations
    const createdTransaction = await MerchantTransaction.findByPk(
      merchantTransaction.id,
      {
        include: [
          {
            model: Vendor,
            as: "merchant",
            attributes: ["id", "name", "phone_no"],
          },
          {
            model: Transaction,
            as: "farmer_transaction",
            include: [
              {
                model: Vendor,
                as: "vendor",
                attributes: ["id", "name", "phone_no"],
              },
            ],
          },
        ],
      }
    );

    // If transaction_id exists, update the original transaction
    if (req.body.transaction_id) {
      await Transaction.update(
        { merchant_vendor_id: req.body.vendor_id },
        { where: { id: req.body.transaction_id } }
      );
    }

    console.log(
      "Successfully created merchant transaction:",
      createdTransaction
    );
    res.status(201).json({
      success: true,
      data: createdTransaction,
      message: "Merchant transaction created successfully",
    });
  } catch (err) {
    console.error("Error in create merchant transaction:", err);
    res.status(400).json({
      success: false,
      message:
        err.message || "Error occurred while creating merchant transaction.",
      error: err,
    });
  }
};

// Get all merchant transactions
exports.findAll = async (req, res) => {
  try {
    const { vendor_id, start_date, end_date } = req.query;
    console.log("Query params:", { vendor_id, start_date, end_date });

    const where = {};

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

    console.log("Final where clause:", JSON.stringify(where, null, 2));

    const merchantTransactions = await MerchantTransaction.findAll({
      where,
      include: [
        {
          model: Vendor,
          as: "merchant",
          attributes: ["id", "name", "phone_no"],
        },
        {
          model: Transaction,
          as: "farmer_transaction",
          include: [
            {
              model: Vendor,
              as: "vendor",
              attributes: ["id", "name", "phone_no"],
            },
          ],
        },
      ],
      order: [["date", "DESC"]],
    });

    console.log(`Found ${merchantTransactions.length} merchant transactions`);
    res.json(merchantTransactions);
  } catch (err) {
    console.error("Error in findAll:", err);
    res.status(500).json({
      message:
        err.message || "Error occurred while retrieving merchant transactions.",
    });
  }
};

// Get merchant transaction by ID
exports.findOne = async (req, res) => {
  try {
    const merchantTransaction = await MerchantTransaction.findByPk(
      req.params.id,
      {
        include: [
          {
            model: Vendor,
            as: "merchant",
            attributes: ["id", "name", "phone_no"],
          },
          {
            model: Transaction,
            as: "farmer_transaction",
            include: [
              {
                model: Vendor,
                as: "vendor",
                attributes: ["id", "name", "phone_no"],
              },
            ],
          },
        ],
      }
    );

    if (!merchantTransaction) {
      return res
        .status(404)
        .json({ message: "Merchant transaction not found" });
    }

    res.json(merchantTransaction);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Error occurred while retrieving merchant transaction.",
    });
  }
};

// Update merchant transaction
exports.update = async (req, res) => {
  try {
    const [updated] = await MerchantTransaction.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated === 0) {
      return res
        .status(404)
        .json({ message: "Merchant transaction not found" });
    }

    const merchantTransaction = await MerchantTransaction.findByPk(
      req.params.id
    );
    res.json(merchantTransaction);
  } catch (err) {
    res.status(400).json({
      message:
        err.message || "Error occurred while updating merchant transaction.",
    });
  }
};

// Delete merchant transaction
exports.delete = async (req, res) => {
  try {
    const deleted = await MerchantTransaction.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Merchant transaction not found" });
    }

    res.json({ message: "Merchant transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Error occurred while deleting merchant transaction.",
    });
  }
};

// Get merchant transactions by transaction ID
exports.findByTransactionId = async (req, res) => {
  try {
    const merchantTransactions = await MerchantTransaction.findAll({
      where: { transaction_id: req.params.transactionId },
      include: [
        {
          model: Vendor,
          as: "merchant",
          attributes: ["id", "name", "phone_no"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json(merchantTransactions);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Error occurred while retrieving merchant transactions.",
    });
  }
};
