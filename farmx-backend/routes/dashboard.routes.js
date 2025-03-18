const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

router.get("/today-stats", dashboardController.getTodayStats);

module.exports = router;
