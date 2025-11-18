// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build single vehicle view
router.get("/detail/:invId", invController.buildByInvId);

// Route to build management view
router.get("/", invController.buildManagementView)

module.exports = router