const utilities = require("../utilities/index.js")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
    res.render("index", { title: "Home", nav })
    console.log('baseController dir:', __dirname);
    console.log('utilities path:', require.resolve("../utilities/index.js"));

}

module.exports = baseController