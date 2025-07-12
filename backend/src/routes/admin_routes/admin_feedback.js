const express = require("express");
const router = express.Router();
const db = require("../../config/db");

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT f.id, u.name as user_name, f.rating, f.comments, f.created_at 
       FROM feedback f
       LEFT JOIN users u ON f.user_id = u.id
       ORDER BY f.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch feedback error:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

module.exports = router;

