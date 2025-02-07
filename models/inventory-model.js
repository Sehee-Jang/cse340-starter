const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

async function getVehicleById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE inv_id = $1`,
      [vehicle_id]
    );
    return data.rows[0]; // Return a single vehicle object
  } catch (error) {
    console.error("getVehicleById error: " + error);
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const query = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING *;`;
    const result = await pool.query(query, [classification_name]);
    return result.rows[0]; // Return the inserted classification
  } catch (error) {
    console.error("addClassification error: " + error);
    throw new Error("Error adding classification");
  }
}

/* ***************************
 *  Update inventory item
 * ************************** */
async function updateInventoryItem(inv_id, updatedData) {
  try {
    const sql = `
      UPDATE public.inventory
      SET
        inv_id = $1,
        inv_make = $2,
        inv_model = $3,
        inv_year = $4,
        inv_description = $5,
        inv_image = $6, 
        inv_thumbnail = $7, 
        inv_price = $8, 
        inv_miles = $9, 
        inv_color = $10, 
        classification_id = $11
      WHERE inv_id = $1 RETURNING *
    `;
    const values = [
      inv_id,
      updatedData.inv_make,
      updatedData.inv_model,
      updatedData.inv_year,
      updatedData.inv_description,
      updatedData.inv_image,
      updatedData.inv_thumbnail,
      updatedData.inv_price,
      updatedData.inv_miles,
      updatedData.inv_color,
      updatedData.classification_id,
    ];

    // SQL 쿼리 및 값 로그
    console.log("SQL Query:", sql);
    console.log("SQL Values:", values);

    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  updateInventoryItem,
};
