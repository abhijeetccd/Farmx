const { Vendor } = require("../models");

// Create a new vendor
exports.create = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all vendors
exports.findAll = async (req, res) => {
  try {
    const { type } = req.query;
    const where = {};

    if (type) {
      where.type = type;
    }

    const vendors = await Vendor.findAll({ where });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error occurred while retrieving vendors.",
    });
  }
};

// Get vendor by ID
exports.findOne = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error occurred while retrieving vendor.",
    });
  }
};

// Update vendor
exports.update = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    await vendor.update(req.body);
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete vendor
exports.delete = async (req, res) => {
  try {
    const deleted = await Vendor.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error occurred while deleting vendor.",
    });
  }
};

// Get vendors by type
exports.findByType = async (req, res) => {
  try {
    const { type } = req.params;
    const vendors = await Vendor.findAll({
      where: { type },
    });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error occurred while retrieving vendors.",
    });
  }
};
