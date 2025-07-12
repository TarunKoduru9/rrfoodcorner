const express = require("express");
const router = express.Router();
const db = require("../../config/db"); 
const authorize = require("../../middleware/authorize");

router.get("/", authorize(["admin", "manager", "superadmin", "delivery"]), async (req, res) => {
  const user = req.user; 

  try {
    const [rows] = await db.query(
      "SELECT page_key, can_view, can_create, can_edit, can_delete FROM role_permissions WHERE role = ?",
      [user.role]
    );

    const permissions = {};
    rows.forEach((row) => {
      permissions[row.page_key] = {
        can_view: !!row.can_view,
        can_create: !!row.can_create,
        can_edit: !!row.can_edit,
        can_delete: !!row.can_delete,
      };
    });

    res.json({
      id: user.id,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      permissions,
    });
  } catch (err) {
    console.error("Error fetching permissions:", err);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

module.exports = router;
