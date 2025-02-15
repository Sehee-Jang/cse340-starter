const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // First name is required and must be a string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // Last name is required and must be a string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // Valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // Password is required and must be a strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* **********************************
 *  Check Validation Results
 * ********************************* */
validate.checkResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.errors.map((error) => error.msg);
    const nav = utilities.getNav(); // Assuming you have a getNav() function
    return res.render("account/register", {
      title: "Register",
      nav,
      message: messages.join(", "),
    });
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav(); 
    return res.render("account/register", {
      errors: errors.errors, 
      title: "Registration",
      nav,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }
  next();
};

module.exports = validate;
