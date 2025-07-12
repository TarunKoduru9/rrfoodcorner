const db = require("../../config/db");

const addAddress = async (req, res) => {
  const userId = req.user.id;
  const { house_block_no, area_road, city, district, state, country, pincode } =
    req.body;

  const query = `
    INSERT INTO addresses (
      user_id, house_block_no, area_road, city, district, state, country, pincode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.execute(query, [
      userId,
      house_block_no,
      area_road,
      city,
      district,
      state,
      country,
      pincode,
    ]);
    res.status(201).json({ message: "Address added", id: result.insertId });
  } catch (err) {
    console.error("Add Address Error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

const getAddresses = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute(
      `SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get Address Error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

const updateAddress = async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;

  const { house_block_no, area_road, city, district, state, country, pincode } =
    req.body;

  const query = `
    UPDATE addresses
    SET house_block_no = ?, area_road = ?, city = ?, district = ?, state = ?, country = ?, pincode = ?
    WHERE id = ? AND user_id = ?
  `;

  try {
    const [result] = await db.execute(query, [
      house_block_no,
      area_road,
      city,
      district,
      state,
      country,
      pincode,
      addressId,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Address not found or unauthorized" });
    }

    res.json({ message: "Address updated" });
  } catch (err) {
    console.error("Update Address Error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

const deleteAddress = async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;

  try {
    const [result] = await db.execute(
      `DELETE FROM addresses WHERE id = ? AND user_id = ?`,
      [addressId, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Address not found or unauthorized" });
    }

    res.json({ message: "Address deleted" });
  } catch (err) {
    console.error("Delete Address Error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

module.exports = { addAddress, getAddresses, updateAddress, deleteAddress };
