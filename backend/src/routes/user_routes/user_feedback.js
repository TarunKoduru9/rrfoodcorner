const express = require("express");
const router = express.Router();
const authorize = require("../../middleware/authorize");
const db = require("../../config/db");

router.post('/', authorize("user"), async (req, res) => {
  const user_id = req.user.id;
  const { name, rating, comments } = req.body;

  try {
    await db.execute(
      `INSERT INTO feedback (user_id, name, rating, comments) VALUES (?, ?, ?, ?)`,
      [user_id, name, rating, comments]
    );
    res.status(201).json({ success: true, message: "Feedback submitted" });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

router.post("/foodfeedback", authorize("user"), async (req, res) => {
  const { user_id, item_id, rating, comments } = req.body;
  try {
    await db.execute(
      `INSERT INTO food_feedback (user_id, item_id, rating, comments) VALUES (?, ?, ?, ?)`,
      [user_id, item_id, rating, comments]
    );
    res.status(201).json({ success: true, message: "Feedback submitted" });
  } catch (err) {
    console.error("Food feedback error:", err);
    res.status(500).json({ error: "Failed to submit food feedback" });
  }
});

module.exports = router;
