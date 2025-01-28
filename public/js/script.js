// Password toggle function
function togglePassword() {
  const passwordField = document.getElementById("account_password");
  const type = passwordField.type === "password" ? "text" : "password";
  passwordField.type = type;
}
