const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const inventoryModel = require("../models/inventory-model");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.getInventoryItem = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicleData = await invModel.getVehicleById(vehicleId);
    const classificationData = await invModel.getClassifications();

    if (!vehicleData) {
      return res.status(404).send("errors/404", {
        title: "Vehicle Not Found",
        message: "The vehicle could not be found.",
      });
    }
    console.log("vehicleData", vehicleData);

    let nav = await utilities.getNav();

    res.render("./inventory/detail", {
      title: `${vehicleData.make} ${vehicleData.model}`,
      nav,
      vehicleData,
      classification: classificationData,
    });
  } catch (error) {
    next(error);
  }
};

invCont.renderManagementView = (req, res) => {
  const flashMessage = req.flash("info"); // Flash 메시지 가져오기
  res.render("inventory/management", { flashMessage });
};

invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;
  try {
    await inventoryModel.addClassification(classification_name);
    req.flash("info", "Classification added successfully!");
    res.redirect("/inv/");
  } catch (error) {
    req.flash("error", "Failed to add classification.");
    res.redirect("/inv/add-classification");
  }
};

/* ***************************
 *  Add a new inventory item
 * ************************** */
invCont.addInventoryItem = async (req, res) => {
  const {
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
    return res.redirect("/inv/add-inventory");
  }

  try {
    const newInventoryItem = await invModel.addInventoryItem({
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
    });
    req.flash("info", "Inventory item added successfully!");
    res.redirect("/inv/");
  } catch (error) {
    console.error("addInventoryItem error:", error);
    req.flash("error", "Failed to add inventory item.");
    res.redirect("/inv/add-inventory");
  }
};

module.exports = invCont;
