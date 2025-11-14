const utilities = require("../utilities/index.js")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", { title: "Home", nav })
}

/* ***************************
 *  Intentionally trigger a 500 error
 * ************************** */
baseController.triggerError = async function (req, res, next) {
  const error = new Error("Intentional server error for testing.")
  error.status = 500
  throw error          
}


module.exports = baseController