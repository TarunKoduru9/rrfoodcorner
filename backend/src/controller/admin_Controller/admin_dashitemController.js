const db = require('../../config/db');

exports.getAllCategories = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM categories');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getFoodItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const [results] = await db.query('SELECT * FROM food_items WHERE category_id = ?', [categoryId]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getWhatsNewItems = async (req, res) => {
  try {
    const query = `
      SELECT 
        w.id,
        c.id AS category_id,
        c.name AS category_name,
        fi.id AS food_item_id,
        fi.name AS item_name,
        fi.image_url,
        fi.price,
        fi.subcontent AS description
      FROM whats_new_items w
      JOIN categories c ON w.category_id = c.id
      JOIN food_items fi ON w.food_item_id = fi.id
    `;

    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("getWhatsNewItems error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.setWhatsNewItem = async (req, res) => {
  try {
    const { category_id, food_item_id } = req.body;

    // ✅ Input validation
    if (!category_id || !food_item_id) {
      return res.status(400).json({
        error: "Both category_id and food_item_id are required and must not be null.",
      });
    }

    const query = `
      INSERT INTO whats_new_items (category_id, food_item_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE food_item_id = VALUES(food_item_id)
    `;

    const [result] = await db.query(query, [category_id, food_item_id]);

    res.json({ message: "What's New item set", result });
  } catch (err) {
    console.error("setWhatsNewItem error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


