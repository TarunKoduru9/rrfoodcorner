const db = require("../../config/db");

const getSettings = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM settings LIMIT 1");
    if (result.length === 0) return res.status(404).json({ error: "Settings not found" });

    res.json(result[0]);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getSettings };
