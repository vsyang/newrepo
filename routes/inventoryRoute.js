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

// Route to update vehicle with classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router