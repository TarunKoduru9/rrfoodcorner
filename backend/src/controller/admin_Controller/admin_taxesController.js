const db = require("../../config/db");

exports.getSettings = async (req, res) => {
  try {
    const [[settings]] = await db.execute(
      "SELECT * FROM settings WHERE id = 1"
    );
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSettings = async (req, res) => {
  const { delivery_charge, taxes } = req.body;

  try {
    await db.execute(
      `UPDATE settings SET delivery_charge = ?, taxes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
      [delivery_charge, taxes]
    );

    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
