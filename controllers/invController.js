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
      account_type: req.session.account_type
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
      req.flash(
        "notice",
        `New ${classification_name} classification added successfully.`
      )
      return res.redirect("/inv/")
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
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (!invData || invData.length === 0) {
      return res.json([])
    }

    return res.json(invData)
  } catch (err) {
    next(err)
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

/* ***************************
 *  Build Delete Confirmation View
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const item = await invModel.getInventoryByInvId(inv_id)
    const itemName = `${item.inv_year} ${item.inv_make} ${item.inv_model}`

    res.render("./inventory/delete-confirm", {
      title: `Delete ${itemName}`,
      nav,
      errors: null,
      inv_id: item.inv_id,
      inv_make: item.inv_make,
      inv_model: item.inv_model,
      inv_year: item.inv_year,
      inv_price: item.inv_price,
    })    
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const item = await invModel.getInventoryByInvId(inv_id)
  const itemName = `${item.inv_year} ${item.inv_make} ${item.inv_model}`

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", `The ${itemName} has successfully been deleted`)
    res.redirect('/inv/')
  } else {
    req.flash("notice", `Sorry, the ${itemName} did not get deleted`)
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

/* ***************************
 *  Build Delete Classification View
 * ************************** */
invCont.buildDeleteClassification = async function (req, res, next) {
  try {
    const classification_id = Number(req.params.classificationId)
    const nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()
    const classification = classifications.rows.find(c => c.classification_id === classification_id)

    if (isNaN(classification_id)) {
      req.flash("notice", "Invalid classification ID.")
      return res.redirect("/inv")
    }

    if (!classification) {
      req.flash("notice", "Classification not found.")
      return res.redirect("/inv")
    }

    const count = await invModel.countInventoryByClassification(classification_id)

    if (count > 0) {
      req.flash("notice", "Cannot delete a classification that still has vehicles.")
      return res.redirect("/inv")
    }

    res.render("inventory/delete-classification", {
      title: `Delete ${classification.classification_name}`,
      nav,
      errors: null,
      classification_id,
      classification_name: classification.classification_name
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Delete Classification
 * ************************** */
invCont.deleteClassification = async function (req, res, next) {
  try {
    const classification_id = Number(req.body.classification_id)

    const count = await invModel.countInventoryByClassification(classification_id)
    if (count > 0) {
      req.flash("notice", "Cannot delete a classification that still has vehicles.")
      return res.redirect("/inv")
    }

    const result = await invModel.deleteClassification(classification_id)

    if (result.rowCount > 0) {
      req.flash("notice", "Classification deleted successfully.")
    } else {
      req.flash("notice", "Classification could not be deleted.")
    }

    res.redirect("/inv")
  } catch (error) {
    next(error)
  }
}


module.exports = invCont