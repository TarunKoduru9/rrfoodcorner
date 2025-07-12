const db = require('../../config/db'); 

const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    console.error("getCategories error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getWhatsNewItems = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT fi.id, fi.name, fi.image_url, fi.subcontent, fi.price, fi.category_id
      FROM whats_new_items wn
      JOIN food_items fi ON wn.food_item_id = fi.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("getWhatsNewItems error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { getCategories, getWhatsNewItems };
