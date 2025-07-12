const db = require("../../config/db");


const getAllCoupons = async (req, res) => {
  try {
    const query = `
      SELECT * FROM coupons
      WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY created_at DESC
    `;

    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllCoupons };