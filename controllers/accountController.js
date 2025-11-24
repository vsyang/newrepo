/* ****************************************
*  Account Controller
* *************************************** */
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: ''
  })
}

/* ******************************************
 * Deliver registration view
 *******************************************/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ******************************************
 * Process Registration
 *******************************************/
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password,
    } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email: ''
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Build Account Management View
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav()

    const accountData = res.locals.accountData

    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type,
      account_id: accountData.account_id
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Logout
* *************************************** */
async function logoutAccount(req, res, next) {
  try {
    res.clearCookie("jwt")
    return res.redirect("/")
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Build Account Update View
* *************************************** */
async function buildUpdate(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const account_id = req.params.accountId
    const accountData = await accountModel.getAccountById(account_id)

    if (!accountData) {
      req.flash("notice", "Account not found.")
      return res.redirect("/account/")
    }

    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process Update to Account
* *************************************** */
async function updateAccountInfo(req, res, next) {
  try {
    const {
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    } = req.body

    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (updateResult && updateResult.rowCount > 0) {
      req.flash("notice", "Account information updated successfully.")
      return res.redirect("/account/")
    } else {
      const nav = await utilities.getNav()
      req.flash("notice", "Sorry, the account information could not be updated.")
      return res.status(501).render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process Update to Password
* *************************************** */
async function updatePassword(req, res, next) {
  try {
    const { account_id, account_password } = req.body

    if (!account_password) {
      req.flash("notice", "Please provide a new password.")
      const nav = await utilities.getNav()
      const accountData = await accountModel.getAccountById(account_id)

      return res.status(400).render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
    }

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const updateResult = await accountModel.updatePassword(
      hashedPassword,
      account_id
    )

    if (updateResult && updateResult.rowCount > 0) {
      req.flash("notice", "Password updated successfully.")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the password could not be updated.")
      const nav = await utilities.getNav()
      const accountData = await accountModel.getAccountById(account_id)

      return res.status(501).render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  logoutAccount,
  buildUpdate,
  updateAccountInfo,
  updatePassword
}