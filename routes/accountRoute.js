const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");

router.get("/login", accountController.buildLogin);

// Build the registration view
router.get("/register", accountController.buildRegister);

// Process the registration data
router.post("/register", accountController.registerAccount);

router.post("/login", accountController.loginAccount);

router.get("/", utilities.checkLogin, accountController.accountManagement);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = router;
