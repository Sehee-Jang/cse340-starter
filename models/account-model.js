const pool = require("../database/");

const accountModel = {};

/* **********************
 *   Check for existing email
 * ********************* */
// async function checkExistingEmail(account_email) {
//   try {
//     const sql = "SELECT * FROM account WHERE account_email = $1";
//     const email = await pool.query(sql, [account_email]);
//     return email.rowCount;
//   } catch (error) {
//     return error.message;
//   }
// }

// module.exports = {
//   checkExistingEmail,
// };

accountModel.checkExistingEmail = async (email) => {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [email]
    );
    return result.rows[0]; // Return the user if the email exists
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
};

accountModel.createAccount = async ({
  account_firstname,
  account_lastname,
  account_email,
  account_password,
}) => {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/* *****************************
 * Return account data using email address
 * ***************************** */
accountModel.getAccountByEmail = async (account_email) => {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
};

module.exports = accountModel;
