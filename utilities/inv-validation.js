const utilities = require(".")  
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")

const invValidate = {}

/*  **********************************
  *  New Classification Rules
  * ********************************* */
// Rules for classification input  
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z]+$/)
      .withMessage("Please provide a classification name.")
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExists) {
            throw new Error ("Classification already exists. Please add a different classification")
        }          
      })
  ]
}

// Check data and return form if errors 
invValidate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name,
    })
  }
  next()
}

module.exports = invValidate
