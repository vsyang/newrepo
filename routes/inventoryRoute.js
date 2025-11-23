// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build single vehicle view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to build management view
router.get("/", invController.buildManagementView)

// Route to add-classification form (GET)
router.get("/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to build add-inventory view
router.get(
  "/add-vehicle",
  utilities.handleErrors(invController.buildAddVehicle)
)

// Route to add-classification form submission (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)

// Route to add vehicle to inventory
router.post(
  "/add-vehicle",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to get inventory as JSON (for the dropdown / AJAX)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build edit-vehicle view (GET)
router.get(
  "/edit/:invId",
  utilities.handleErrors(invController.buildEditInventory)
)

// Route to update vehicle (POST)
router.post(
  "/edit",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router