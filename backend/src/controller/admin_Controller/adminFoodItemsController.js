const db = require("../../config/db");
const path = require("path");
const fs = require("fs");

exports.getAllFoodItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM food_items");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

exports.createFoodItem = async (req, res) => {
  const {
    item_code,
    name,
    category_id,
    food_type,
    combo_type,
    price,
    subcontent,
  } = req.body;

  if (!item_code || !name || !category_id || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const imageUrl = req.file ? "/uploads/items/" + req.file.filename : null;

  try {
    const [catRows] = await db.query("SELECT id FROM categories WHERE id = ?", [category_id]);
    if (catRows.length === 0) {
      return res.status(400).json({ message: "Invalid category_id – no such category exists" });
    }

    const sql = `
      INSERT INTO food_items
      (item_code, name, category_id, food_type, combo_type, price, subcontent, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      item_code,
      name,
      category_id,
      food_type || null,
      combo_type || null,
      price,
      subcontent || null,
      imageUrl,
    ];

    const [result] = await db.query(sql, values);
    res.status(201).json({ message: "Food item created", id: result.insertId });

  } catch (err) {
    res.status(500).json({ message: "Insert failed", error: err });
  }
};

exports.updateFoodItem = async (req, res) => {
  const id = req.params.id;
  const {
    item_code,
    name,
    category_id,
    food_type,
    combo_type,
    price,
    subcontent,
  } = req.body;

  if (!item_code || !name || !category_id || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const imageUrl = req.file ? "/uploads/items/" + req.file.filename : null;

  try {
    const [catRows] = await db.query("SELECT id FROM categories WHERE id = ?", [category_id]);
    if (catRows.length === 0) {
      return res.status(400).json({ message: "Invalid category_id – no such category exists" });
    }

    const [dupCheck] = await db.query(
      "SELECT id FROM food_items WHERE item_code = ? AND id != ?",
      [item_code, id]
    );
    if (dupCheck.length > 0) {
      return res.status(409).json({ message: "Item code already in use by another item" });
    }

    const updateSql = `
      UPDATE food_items SET
        item_code = ?, name = ?, category_id = ?, food_type = ?, combo_type = ?,
        price = ?, subcontent = ?${imageUrl ? `, image_url = ?` : ""}
      WHERE id = ?
    `;

    const values = [
      item_code,
      name,
      category_id,
      food_type || null,
      combo_type || null,
      price,
      subcontent || null,
    ];

    if (imageUrl) values.push(imageUrl);
    values.push(id);

    await db.query(updateSql, values);
    res.json({ message: "Food item updated" });

  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};

exports.deleteFoodItem = async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.query("SELECT image_url FROM food_items WHERE id = ?", [id]);
    const imageUrl = rows[0]?.image_url;

    if (imageUrl) {
      const filePath = path.join(__dirname, "..", imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.query("DELETE FROM food_items WHERE id = ?", [id]);
    res.json({ message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
};
