const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities/utilities");



router.get("/login", accountController.buildLogin);
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Build the registration view
router.get("/register", accountController.buildRegister);
// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(), // Apply validation rules
  regValidate.checkRegData,       // Check data and return errors if any
  utilities.handleErrors(accountController.registerAccount) // Pass valid data to the controller
);
// Register POST route
router.post("/register", async (req, res) => {
  try {
    const { account_first_name, account_last_name, account_email, account_password } = req.body;

    // TODO: 데이터 유효성 검사 및 저장 로직 추가
    console.log("Registration Data:", { account_first_name, account_last_name, account_email });

    // 회원가입 성공 후 로그인 페이지로 리디렉션
    res.redirect("/account/login");
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).render("account/register", {
      title: "Register",
      message: "An error occurred during registration. Please try again.",
    });
  }
});


module.exports = router;
