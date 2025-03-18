const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");

router.post("/", vendorController.create);
router.get("/", vendorController.findAll);
router.get("/type/:type", vendorController.findByType);
router.get("/:id", vendorController.findOne);
router.put("/:id", vendorController.update);
router.delete("/:id", vendorController.delete);

module.exports = router;
