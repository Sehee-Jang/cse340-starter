const utilities = require("../utilities/");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    message: null,
    errors: null,
  });
}

const buildRegister = async (req, res) => {
  try {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null, // Initialize errors array to prevent rendering issues
    });
  } catch (error) {
    console.error("Error rendering registration view:", error);
    res.status(500).send("An error occurred.");
  }
};

module.exports = { buildLogin, buildRegister };
