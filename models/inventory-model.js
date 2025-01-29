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

// async function addClassification (classification_name) {
//   const sql = "INSERT INTO classification (classification_name) VALUES (?)";
//   return db.query(sql, [classification_name]);
// };

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


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
};
