const { MerchantCommission } = require("../models");

exports.create = async (req, res) => {
  try {
    const commission = await MerchantCommission.create(req.body);
    res.status(201).json(commission);
  } catch (error) {
    res.status(400).json({
      message: "Error creating commission",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await MerchantCommission.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedCommission = await MerchantCommission.findByPk(id);
      res.json(updatedCommission);
    } else {
      res.status(404).json({ message: "Commission not found" });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error updating commission",
      error: error.message,
    });
  }
};

exports.findByMerchantAndDate = async (req, res) => {
  try {
    const { vendor_id, date } = req.params;
    const commission = await MerchantCommission.findOne({
      where: { vendor_id, date },
    });
    res.json(commission);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching commission",
      error: error.message,
    });
  }
};
