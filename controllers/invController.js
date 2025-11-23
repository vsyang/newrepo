const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single vehicle view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicleData = await invModel.getInventoryByInvId(inv_id)

    console.log("Vehicle data:", vehicleData) // debug

    if (!vehicleData) {
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }

    const nav = await utilities.getNav()
    const vehicleSingle = utilities.buildVehicleDetail(vehicleData)
    const title = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`

    res.render("./inventory/detail", {
      title,
      nav,
      vehicle: vehicleData,
      vehicleSingle,
    })
  } catch (err) {
    err.status = err.status || 500
    next(err)
  }
}

/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      notice: req.flash("notice"),
      errors: null,
      classificationSelect,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: "",
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Insert new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body

    const result = await invModel.addClassification(classification_name)

    if (result.rowCount > 0) {
      req.flash("notice", `New ${classification_name} classification added successfully.`)
      const nav = await utilities.getNav()
      return res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      })
    } else {
      req.flash("notice", "Provide a correct classification name.")
      const nav = await utilities.getNav()
      return res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        classification_name,
        errors: null,
      })
    }
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build Add New Vehicle View
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Add New Vehicle Into Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
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

    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    if (result.rowCount > 0) {
      req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`)
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the vehicle could not be added.")
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(classification_id)
      return res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
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
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit View with Values Already Filled
 * ************************** */
invCont.buildEditInventory = async (req, res, next) => {
  try {
    const inv_id = req.params.invId

    const item = await invModel.getInventoryByInvId(inv_id)

    if (!item) {
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }

    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(item.classification_id)

    res.render("inventory/edit-inventory", {
      title: "Edit " + item.inv_year + " " + item.inv_make + " " + item.inv_model,
      nav,
      classificationList,
      errors: null,
      inv_id: item.inv_id,
      inv_make: item.inv_make,
      inv_model: item.inv_model,
      inv_description: item.inv_description,
      inv_image: item.inv_image,
      inv_thumbnail: item.inv_thumbnail,
      inv_price: item.inv_price,
      inv_year: item.inv_year,
      inv_miles: item.inv_miles,
      inv_color: item.inv_color,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process vehicle update
 * ************************** */
invCont.updateInventory = async (req, res, next) => {
  try {
    const {
      inv_id,
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

    const result = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    if (result.rowCount > 0) {
      req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully updated.`)
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the vehicle could not be updated.")
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(classification_id)

      return res.status(501).render("inventory/edit-inventory", {
        title: `Edit ${inv_year} ${inv_make} ${inv_model}`,
        nav,
        classificationList,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = invCont