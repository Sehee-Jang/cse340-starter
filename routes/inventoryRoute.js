// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display vehicle details by inventory ID
// router.get("/inv/detail/:invId", invController.buildByInvId);
router.get("/detail/:vehicleId", invController.getInventoryItem);

module.exports = router;
