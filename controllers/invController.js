const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

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
// 수정 전
// invCont.renderManagementView = (req, res) => {
//   const flashMessage = req.flash("info"); // Flash 메시지 가져오기
//   res.render("inventory/management", { flashMessage });
// };

invCont.buildManagementView = async (req, res) => {
  console.log("Build Management View called");
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const flashMessage = req.flash("info");

  if (!Array.isArray(classificationSelect)) {
    console.error(
      "classificationSelect is not an array:",
      classificationSelect
    );
    classificationSelect = [];
  }

  console.log("classificationSelect:", classificationSelect);

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    flashMessage,
  });
};

invCont.getInventoryJSON = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const inventoryData = await invModel.getInventoryByClassificationId(
      classification_id
    );

    if (!inventoryData.length) {
      return res
        .status(404)
        .json({ message: "No vehicles found for this classification." });
    }

    res.json(inventoryData);
  } catch (error) {
    next(error);
  }
};

invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;
  try {
    await invModel.addClassification(classification_name);
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

// ***************************
// Edit inventory view
// ***************************
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id); // URL로 전달된 inv_id를 받아옴
    console.log("req.params.inv_id: ", req.params.inv_id);
    console.log("inv_id: ", inv_id);
    let nav = await utilities.getNav(); // 네비게이션 데이터를 가져옴
    const itemData = await invModel.getVehicleById(inv_id); // 차량 데이터를 DB에서 가져옴

    // If itemData is not found, return 404 error
    if (!itemData) {
      return res.status(404).send("Item not found");
    }

    // Classification dropdown list
    const classificationSelect = await utilities.buildClassificationList(
      itemData.classification_id
    );

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`; // 차량 이름 (제조사 + 모델)

    // Render edit-inventory view
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    console.error("Error loading inventory edit page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ***************************
// Update inventory item
// ***************************
// invCont.updateInventory = async function (req, res) {
//   let nav = await utilities.getNav();
//   const {
//     inv_id,
//     inv_make,
//     inv_model,
//     inv_description,
//     inv_image,
//     inv_thumbnail,
//     inv_price,
//     inv_year,
//     inv_miles,
//     inv_color,
//     classification_id,
//   } = req.body;

//   const updateResult = await invModel.updateInventory(
//     inv_id,
//     inv_make,
//     inv_model,
//     inv_description,
//     inv_image,
//     inv_thumbnail,
//     inv_price,
//     inv_year,
//     inv_miles,
//     inv_color,
//     classification_id
//   );

//   if (updateResult) {
//     const itemName = updateResult.inv_make + " " + updateResult.inv_model;
//     req.flash("notice", `The ${itemName} was successfully updated.`);
//     res.redirect("/inv/");
//   } else {
//     req.flash("notice", "Sorry, the update failed.");
//     const classificationSelect = await utilities.buildClassificationList(
//       classification_id
//     );
//     const itemName = `${inv_make} ${inv_model}`;
//     res.status(501).render("inventory/edit-inventory", {
//       title: "Edit " + itemName,
//       nav,
//       classificationSelect: classificationSelect,
//       errors: null,
//       inv_id,
//       inv_make,
//       inv_model,
//       inv_year,
//       inv_description,
//       inv_image,
//       inv_thumbnail,
//       inv_price,
//       inv_miles,
//       inv_color,
//       classification_id,
//       messages: req.flash(),
//     });
//   }
// };

invCont.updateInventory = async (req, res) => {
  const inv_id = parseInt(req.params.inv_id);
  console.log("req.params.inv_id: ", req.params.inv_id);

  if (isNaN(inv_id)) {
    req.flash("error", "Invalid inventory ID.");
    return res.redirect(`/inv/edit/${req.params.inv_id}`);
  }

  const updatedData = req.body;

  try {
    console.log("Received body data: ", updatedData);
    const updateResult = await invModel.updateInventoryItem(
      inv_id,
      updatedData
    );

    console.log("Update result: ", updateResult.rowCount);
    if (updateResult.rowCount > 0) {
      req.flash("success", "Inventory item updated successfully!");
      res.redirect(`/inv/detail/${inv_id}`);
    } else {
      req.flash("error", "Failed to update inventory.");
      res.redirect(`/inv/edit/${inv_id}`);
    }
  } catch (error) {
    console.error("Update error:", error);
    req.flash("error", "An error occurred while updating inventory.");
    res.redirect(`/inv/edit/${inv_id}`);
  }
};

module.exports = invCont;
