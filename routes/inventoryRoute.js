// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build single vehicle view
router.get("/detail/:invId", invController.buildByInvId);

// Route to build management view
router.get("/", invController.buildManagementView)

// Route to add-classification form (GET)
router.get("/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to add-classification form submission (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)

module.exports = router