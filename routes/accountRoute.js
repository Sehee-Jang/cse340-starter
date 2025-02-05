const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");

router.get("/login", accountController.buildLogin);

// Build the registration view
router.get("/register", accountController.buildRegister);

// Process the registration data
router.post("/register", accountController.registerAccount);

router.post("/login", accountController.loginAccount);

router.get("/", accountController.accountManagement);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = router;
