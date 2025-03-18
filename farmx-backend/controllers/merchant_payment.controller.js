const { MerchantPayment, Vendor } = require("../models");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  try {
    const payment = await MerchantPayment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({
      message: "Error creating payment record",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await MerchantPayment.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedPayment = await MerchantPayment.findByPk(id);
      res.json(updatedPayment);
    } else {
      res.status(404).json({ message: "Payment record not found" });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error updating payment record",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MerchantPayment.destroy({
      where: { id },
    });
    if (deleted) {
      res.json({ message: "Payment record deleted" });
    } else {
      res.status(404).json({ message: "Payment record not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error deleting payment record",
      error: error.message,
    });
  }
};

exports.getByMerchant = async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { from, to } = req.query;

    // Validate merchant ID
    if (!merchantId) {
      return res.status(400).json({ message: "Merchant ID is required" });
    }

    const whereClause = {
      vendor_id: merchantId,
    };

    // Add date filtering if dates are provided
    if (from && to) {
      whereClause.date = {
        [Op.between]: [from, to],
      };
    }

    const payments = await MerchantPayment.findAll({
      where: whereClause,
      include: [
        {
          model: Vendor,
          as: "merchant",
          attributes: ["id", "name"],
        },
      ],
      order: [["date", "ASC"]],
    });

    // Calculate totals
    const totals = payments.reduce(
      (acc, payment) => {
        const amount = parseFloat(payment.amount) || 0;
        if (payment.type === "नावे") {
          acc.total_receivable += amount;
        } else {
          acc.total_received += amount;
        }
        return acc;
      },
      { total_receivable: 0, total_received: 0 }
    );

    res.json({
      payments,
      totals: {
        ...totals,
        balance: totals.total_receivable - totals.total_received,
      },
    });
  } catch (error) {
    console.error("Error in getByMerchant:", error);
    res.status(500).json({
      message: "Error fetching payment records",
      error: error.message,
    });
  }
};
