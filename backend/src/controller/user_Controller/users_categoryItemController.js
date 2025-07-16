const db = require("../../config/db");

const getCategoryItems = async (req, res) => {
  const categoryId = req.params.id;
  const { food_type, sort, keyword } = req.query;

  try {
    let query = `
      SELECT 
        fi.id, fi.name, fi.price, fi.subcontent, fi.image_url,
        fi.food_type, fi.combo_type, fi.category_id,
        c.name AS category_name
      FROM food_items fi
      JOIN categories c ON fi.category_id = c.id
      WHERE fi.category_id = ?
    `;
    const params = [categoryId];

    if (food_type) {
      query += ` AND fi.food_type = ?`;
      params.push(food_type);
    }

    if (keyword) {
      query += ` AND fi.name LIKE ?`;
      params.push(`%${keyword}%`);
    }

    if (sort === "asc") {
      query += ` ORDER BY fi.price ASC`;
    } else if (sort === "desc") {
      query += ` ORDER BY fi.price DESC`;
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("getCategoryItems error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCategoryKeywords = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const query = `
      SELECT DISTINCT k.id, k.name
      FROM keywords k
      WHERE EXISTS (
        SELECT 1
        FROM food_items fi
        WHERE fi.category_id = ? AND fi.name LIKE CONCAT('%', k.name, '%')
      )
    `;
    const [rows] = await db.query(query, [categoryId]);
    res.json(rows);
  } catch (err) {
    console.error("getCategoryKeywords error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCategoryFoodTypes = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const query = `
      SELECT DISTINCT fi.food_type
      FROM food_items fi
      WHERE fi.category_id = ?
    `;
    const [rows] = await db.query(query, [categoryId]);
    const types = rows.map((row) => row.food_type); // e.g., ["VEG", "NON VEG"]
    res.json(types);
  } catch (err) {
    console.error("getCategoryFoodTypes error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMenuItems = async (req, res) => {
  const { food_type, sort, keyword, category_id } = req.query;

  try {
    let query = `
      SELECT id, name, price, subcontent, image_url, food_type, combo_type, category_id
      FROM food_items
      WHERE 1
    `;
    const params = [];

    if (food_type) {
      query += ` AND food_type = ?`;
      params.push(food_type);
    }

    if (keyword) {
      query += ` AND name LIKE ?`;
      params.push(`%${keyword}%`);
    }

    if (category_id) {
      query += ` AND category_id = ?`;
      params.push(category_id);
    }

    if (sort === "asc") {
      query += ` ORDER BY price ASC`;
    } else if (sort === "desc") {
      query += ` ORDER BY price DESC`;
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("getAllMenuItems error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMenuFoodTypes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT food_type FROM food_items
    `);
    const types = rows.map((row) => row.food_type);
    res.json(types);
  } catch (err) {
    console.error("getAllMenuFoodTypes error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMenuKeywords = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT k.id, k.name
      FROM keywords k
      WHERE EXISTS (
        SELECT 1 FROM food_items fi
        WHERE fi.name LIKE CONCAT('%', k.name, '%')
      )
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAllMenuKeywords error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMenuCategories = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name FROM categories
      ORDER BY name
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAllMenuCategories error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCategoryItems,
  getCategoryKeywords,
  getCategoryFoodTypes,
  getAllMenuItems,
  getAllMenuFoodTypes,
  getAllMenuKeywords,
  getAllMenuCategories,
};
