const utilities = require("../utilities/");
const pool = require("../database/");
const bcrypt = require("bcrypt");

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

async function accountManagement(req, res) {
  try {
    let nav = await utilities.getNav();

    if (!req.session.user) {
      console.log("No session - Redirecting to login page");
      return res.redirect("/login");
    }

    // Set flash message and render account page
    req.flash("info", "You have successfully logged in!");

    res.render("account/account", {
      title: "Account",
      nav,
      message: req.flash("info"),
      user: req.session.user, // Pass session user info
      errors: null,
    });
  } catch (error) {
    console.error("Error rendering account management page:", error);
    if (!res.headersSent) {
      res.status(500).send("erver error occurred!");
    }
  }
}

// Add the registerAccount function
const registerAccount = async (req, res) => {
  try {
    const {
      account_first_name,
      account_last_name,
      account_email,
      account_password,
    } = req.body;

    console.log("Registration request data:", {
      account_first_name,
      account_last_name,
      account_email,
    });

    // 필수 필드 확인
    if (
      !account_first_name ||
      !account_last_name ||
      !account_email ||
      !account_password
    ) {
      return res.status(400).send("Please fill in all required fields.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    try {
      // 데Save user to the database
      const result = await pool.query(
        "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *",
        [account_first_name, account_last_name, account_email, hashedPassword]
      );

      // Log successful registration
      console.log("✅ 등록된 사용자:", result.rows[0]);

      //  Redirect to login page after successful registration
      setTimeout(() => res.redirect("/account/login"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).send("Server error, please try again.");
    }
  } catch (error) {
    console.error("Registration processing error:", error);
    res.status(500).send("An issue occurred during registration.");
  }
};
const loginAccount = async (req, res) => {
  try {
    const { account_email, account_password } = req.body;

    // Find user
    const user = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [account_email]
    );

    if (user.rowCount === 0) {
      return res.status(401).send("Email not registered.");
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      account_password,
      user.rows[0].account_password
    );
    if (!validPassword) {
      return res.status(401).send("Incorrect password.");
    }

    // 로그인 성공 후 세션 설정
    req.session.user = user.rows[0];
    console.log("Login successful: ", req.session.user);

    res.redirect("/account"); // 로그인 성공 후 이동할 페이지
  } catch (error) {
    console.error("Login processing error: ", error);
    res.status(500).send("Server error occurred!");
  }
};

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  accountManagement,
};
