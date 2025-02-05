// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display vehicle details by inventory ID
router.get("/detail/:vehicleId", invController.getInventoryItem);

router.get("/", invController.buildManagementView);
router.get("/getInventory/:classificationId", invController.getInventoryJSON);

router.post("/add-classification", invController.addClassification);
router.post("/add-inventory", invController.addInventoryItem);

module.exports = router;
