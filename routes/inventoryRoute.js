// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const { checkUpdateData } = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display vehicle details by inventory ID
router.get("/detail/:vehicleId", invController.getInventoryItem);

router.get("/", invController.buildManagementView);

// Route to display edit inventory view
router.get("/edit/:inv_id", invController.editInventoryView);

router.get("/getInventory/:classificationId", invController.getInventoryJSON);

router.post("/update/:inv_id", checkUpdateData, invController.updateInventory);

router.post("/add-classification", invController.addClassification);
router.post("/add-inventory", invController.addInventoryItem);

module.exports = router;
