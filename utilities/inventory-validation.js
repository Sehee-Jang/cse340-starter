function checkUpdateData(req, res, next) {
  const {
    inv_id,
    classification_id,
    make,
    model,
    year,
    description,
    price,
    image_url,
    thumbnail_url,
    mileage,
    color,
  } = req.body;

  if (
    !classification_id ||
    !make ||
    !model ||
    !year ||
    !description ||
    !price ||
    !image_url ||
    !thumbnail_url ||
    !mileage ||
    !color
  ) {
    req.flash("error", "All fields are required.");
    return res.redirect("/inv/edit/" + inv_id);
  }

  next();
}

module.exports = { checkUpdateData };
