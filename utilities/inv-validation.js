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

// Rules for new inventory (vehicle) input
invValidate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."),

    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),

    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 9999 })
      .withMessage("Please provide a valid year."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a path for the image."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a path for the thumbnail."),

    body("inv_price")
      .trim()
      .isFloat({ min: 1 })
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please provide valid miles."),

    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),

    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please choose a classification."),
  ]
}

// Check inventory data and return form if errors
invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)

    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
  next()
}

module.exports = invValidate