function checkUpdateData(req, res, next) {
  console.log("🔹 Middleware executed!");
  console.log("🔹 Received Data:", req.body);

  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_image,
    inv_thumbnail,
    inv_miles,
    inv_color,
  } = req.body;

  if (
    !classification_id ||
    !inv_make ||
    !inv_model ||
    !inv_year ||
    !inv_description ||
    !inv_price ||
    !inv_image ||
    !inv_thumbnail ||
    !inv_miles ||
    !inv_color
  ) {
    req.flash("error", "All fields are required.");
    console.log("🔹 Validation Failed! Redirecting...");
    return res.redirect("/inv/edit/" + inv_id);
  }

  next();
}

module.exports = { checkUpdateData };
