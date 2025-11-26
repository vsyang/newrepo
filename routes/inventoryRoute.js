// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")

/* ******************************************
 * Route to build inventory by classification view
 *******************************************/
router.get("/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId));

/* ******************************************
 * Route to build single vehicle view
 *******************************************/  
router.get("/detail/:invId",
  utilities.handleErrors(invController.buildByInvId));

/* ******************************************
 * Update account info (firstname, lastname, email)
 *******************************************/
// Route to build management view
router.get("/",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildManagementView))

/* ******************************************
 * Route to add-classification form (GET)
 *******************************************/
router.get("/add-classification",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddClassification)
)

/* ******************************************
 * Route to build add-inventory view
 *******************************************/
router.get(
  "/add-vehicle",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddVehicle)
)

/* ******************************************
 * Route to add-classification form submission
 *******************************************/
router.post(
  "/add-classification",
  utilities.checkAuthorization,
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)

/* ******************************************
 * Route to add vehicle to inventory
 *******************************************/
router.post(
  "/add-vehicle",
  utilities.checkAuthorization,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

/* ******************************************
 * Route to get inventory as JSON (for the dropdown)
 *******************************************/
router.get(
  "/getInventory/:classification_id",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ******************************************
 * Route to build edit-vehicle view
 *******************************************/
router.get(
  "/edit/:invId",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildEditInventory)
)

/* ******************************************
 * Route to update vehicle 
 *******************************************/
router.post(
  "/edit",
  utilities.checkAuthorization,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

/* ******************************************
 * Route to build delete-confirmation view (vehicle)
 *******************************************/
router.get("/delete/:invId", 
  utilities.checkAuthorization,
  utilities.handleErrors(invController.deleteView)
)

/* ******************************************
 * Route to process the delete inventory request (vehicle)
 *******************************************/
router.post("/delete", 
  utilities.checkAuthorization,
  utilities.handleErrors(invController.deleteItem)
)

/* ******************************************
 * Route to build delete classification
 *******************************************/
router.get(
  "/delete-classification/:classificationId",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildDeleteClassification)
)

/* ******************************************
 * Route to process classification deletion
 *******************************************/
router.post("/delete-classification",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.deleteClassification)  
)

router.post(
  "/delete-classification",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.deleteClassification)
)
module.exports = router