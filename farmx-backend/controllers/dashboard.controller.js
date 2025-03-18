const {
  Transaction,
  Vendor,
  MerchantTransaction,
  MerchantCommission,
} = require("../models");
const { Op, Sequelize } = require("sequelize");

exports.getTodayStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;
    const endOfYear = `${currentYear}-12-31`;

    // Get farmer transactions
    const farmerTransactions = await Transaction.findAll({
      where: {
        date: today,
      },
      include: [
        {
          model: Vendor,
          as: "vendor",
          where: { type: "farmer" },
        },
      ],
    });

    // Get merchant transactions
    const merchantTransactions = await MerchantTransaction.findAll({
      where: {
        date: today,
      },
      include: [
        {
          model: Vendor,
          as: "merchant",
          where: { type: "merchant" },
        },
      ],
    });

    // Calculate totals
    const farmerStats = farmerTransactions.reduce(
      (acc, curr) => ({
        totalBags: acc.totalBags + curr.bags,
        totalAmount: acc.totalAmount + parseFloat(curr.amount),
      }),
      { totalBags: 0, totalAmount: 0 }
    );

    const merchantStats = merchantTransactions.reduce(
      (acc, curr) => ({
        totalBags: acc.totalBags + curr.bags,
        totalAmount: acc.totalAmount + parseFloat(curr.amount),
      }),
      { totalBags: 0, totalAmount: 0 }
    );

    // Get yearly commission stats
    const yearlyCommissionStats = await MerchantCommission.findAll({
      where: {
        date: {
          [Op.between]: [startOfYear, endOfYear],
        },
      },
      include: [
        {
          model: Vendor,
          as: "merchant",
          attributes: ["id", "name"],
        },
      ],
      attributes: [
        "vendor_id",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_commission"],
        [Sequelize.fn("SUM", Sequelize.col("weight")), "total_weight"],
      ],
      group: ["vendor_id", "merchant.id", "merchant.name"],
      order: [[Sequelize.fn("SUM", Sequelize.col("amount")), "DESC"]],
    });

    // Calculate total commission for the year
    const totalYearlyCommission = await MerchantCommission.sum("amount", {
      where: {
        date: {
          [Op.between]: [startOfYear, endOfYear],
        },
      },
    });

    res.json({
      farmerTransactions,
      merchantTransactions,
      stats: {
        totalBags: farmerStats.totalBags,
        farmerAmount: farmerStats.totalAmount,
        merchantAmount: merchantStats.totalAmount,
      },
      commission_stats: {
        total_yearly_commission: totalYearlyCommission || 0,
        merchant_wise_commission: yearlyCommissionStats.map((stat) => ({
          merchant_id: stat.vendor_id,
          merchant_name: stat.merchant.name,
          total_commission: parseFloat(stat.dataValues.total_commission) || 0,
          total_weight: parseFloat(stat.dataValues.total_weight) || 0,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};
