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
// const updateInventoryItem = async ({
//   inv_id,
//   classification_id,
//   make,
//   model,
//   year,
//   description,
//   price,
//   image_url,
//   thumbnail_url,
//   mileage,
//   color,
// }) => {
//   const query = `
//     UPDATE inventory
//     SET classification_id = ?, make = ?, model = ?, year = ?, description = ?, price = ?, image_url = ?, thumbnail_url = ?, mileage = ?, color = ?
//     WHERE inv_id = ?;
//   `;
//   const params = [
//     classification_id,
//     make,
//     model,
//     year,
//     description,
//     price,
//     image_url,
//     thumbnail_url,
//     mileage,
//     color,
//     inv_id,
//   ];

//   try {
//     const result = await db.query(query, params); // db.query를 통해 데이터베이스에 업데이트 쿼리 실행
//     return result;
//   } catch (error) {
//     console.error("Error in updateInventoryItem:", error);
//     throw error;
//   }
// };

// async function updateInventory(
//   inv_id,
//   inv_make,
//   inv_model,
//   inv_description,
//   inv_image,
//   inv_thumbnail,
//   inv_price,
//   inv_year,
//   inv_miles,
//   inv_color,
//   classification_id
// ) {
//   try {
//     const sql =
//       "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
//     const data = await pool.query(sql, [
//       inv_make,
//       inv_model,
//       inv_description,
//       inv_image,
//       inv_thumbnail,
//       inv_price,
//       inv_year,
//       inv_miles,
//       inv_color,
//       classification_id,
//       inv_id,
//     ]);
//     return data.rows[0];
//   } catch (error) {
//     console.error("model error: " + error);
//   }
// }

async function updateInventoryItem(inv_id, updatedData) {
  try {
    const sql = `
      UPDATE public.inventory
      SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4,inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *
    `;
    const values = [
      updatedData.classification_id,
      updatedData.make,
      updatedData.model,
      updatedData.year,
      updatedData.description,
      updatedData.price,
      updatedData.image_url,
      updatedData.thumbnail_url,
      updatedData.mileage,
      updatedData.color,
      inv_id,
    ];
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
