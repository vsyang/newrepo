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

    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      notice: req.flash("notice"),
    })
  } catch (err) {
    next(err)
  }
}

module.exports = invCont