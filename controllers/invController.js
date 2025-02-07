const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const pool = require("../database/");

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
  let classificationSelect = await utilities.buildClassificationList();
  const flashMessage = req.flash("info");

  if (!Array.isArray(classificationSelect)) {
    console.error(
      "classificationSelect is not an array:",
      classificationSelect
    );
    classificationSelect = [];
  }

  console.log("📍 classificationSelect:", classificationSelect);
  console.log("📍 Type of classificationSelect:", typeof classificationSelect);

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
    console.log("📍 Fetched classificationSelect:", classificationSelect.rows);
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
// invCont.updateInventory = async (req, res) => {
//   const inv_id = parseInt(req.params.inv_id);
//   console.log("Update request received for inv_id: ", inv_id);

//   if (isNaN(inv_id)) {
//     req.flash("error", "Invalid inventory ID.");
//     return res.redirect(`/inv/edit/${req.params.inv_id}`);
//   }

//   const updatedData = req.body;

//   try {
//     console.log("Received body data: ", updatedData);

//     const updateResult = await invModel.updateInventoryItem(
//       inv_id,
//       updatedData
//     );

//     console.log("Update result: ", updateResult.rowCount);

//     if (updateResult.rowCount > 0) {
//       req.flash("success", "Inventory item updated successfully!");
//       res.redirect(`/inv/detail/${inv_id}`);
//     } else {
//       req.flash("error", "Failed to update inventory.");
//       res.redirect(`/inv/edit/${inv_id}`);
//     }
//   } catch (error) {
//     console.error("Update error:", error);
//     req.flash("error", "An error occurred while updating inventory.");
//     res.redirect(`/inv/edit/${inv_id}`);
//   }
// };
// invCont.updateInventory = async (req, res) => {
//   const inv_id = parseInt(req.params.inv_id);
//   console.log("Update request received for inv_id:", inv_id);

//   const {
//     classification_id,
//     inv_make,
//     inv_model,
//     inv_year,
//     inv_description,
//     inv_price,
//     inv_image,
//     inv_thumbnail,
//     inv_miles,
//     inv_color,
//   } = req.body; // 클라이언트에서 전송한 데이터 받기

//   // 클라이언트에서 받은 데이터 출력
//   console.log("Received data:", req.body); // 클라이언트에서 받은 데이터가 제대로 출력되는지 확인

//   try {
//     // 업데이트 모델 호출 직전에 로그 찍기
//     console.log("Data to update:", {
//       inv_id,
//       classification_id,
//       inv_make,
//       inv_model,
//       inv_year,
//       inv_description,
//       inv_price,
//       inv_image,
//       inv_thumbnail,
//       inv_miles,
//       inv_color,
//     });

//     const result = await invModel.updateInventoryItem({
//       inv_id,
//       classification_id,
//       inv_make,
//       inv_model,
//       inv_year,
//       inv_description,
//       inv_price,
//       inv_image,
//       inv_thumbnail,
//       inv_miles,
//       inv_color,
//     });

//     console.log("Update result:", result); // 결과 확인, 이 로그가 출력되지 않으면 invModel.updateInventoryItem() 함수에 문제가 있음

//     if (result.rowCount > 0) {
//       req.flash("info", "Inventory updated successfully!");
//       return res.redirect("/inv/");
//     } else {
//       req.flash("error", "No rows updated. Check the inv_id.");
//       return res.redirect(`/inv/edit/${inv_id}`);
//     }
//   } catch (error) {
//     console.error("updateInventory error:", error);
//     req.flash("error", "Failed to update inventory.");
//     res.redirect(`/inv/edit/${inv_id}`);
//   }
// };

invCont.updateInventory = async (req, res) => {
  console.log("🔹 updateInventory function called!");
  try {
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

    console.log("🔹 Update Data:", req.body);

    const result = await pool.query(
      `UPDATE inventory 
       SET classification_id = $1, inv_make = $2, inv_model = $3, inv_year = $4, inv_description = $5, 
           inv_price = $6, inv_image = $7, inv_thumbnail = $8, inv_miles = $9, inv_color = $10 
       WHERE inv_id = $11 RETURNING *`,
      [
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
        inv_id,
      ]
    );

    console.log("🔹 Update Result:", result);

    if (result.rowCount === 0) {
      req.flash("error", "Update failed. Item not found.");
      return res.redirect("/inv/edit/" + inv_id);
    }

    req.flash("success", "Inventory updated successfully!");
    res.redirect("/inv/");
  } catch (err) {
    console.error("🔹 Update Error:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/inv/edit/" + req.body.inv_id);
  }
};

module.exports = invCont;
