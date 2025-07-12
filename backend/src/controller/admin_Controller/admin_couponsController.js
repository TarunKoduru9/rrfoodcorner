const db = require("../../config/db");

exports.getAllCoupons = async (req, res) => {
  try {
    const [coupons] = await db.query("SELECT * FROM coupons ORDER BY created_at DESC");
    res.json(coupons);
  } catch (err) {
    console.error("Get coupons error:", err);
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_value,
      max_discount,
      expires_at,
      is_active,
    } = req.body;

    await db.query(
      `INSERT INTO coupons 
        (code, description, discount_type, discount_value, min_order_value, max_discount, expires_at, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code,
        description,
        discount_type,
        discount_value,
        min_order_value || 0,
        max_discount || null,
        expires_at,
        is_active !== false,
      ]
    );

    res.status(201).json({ message: "Coupon created successfully" });
  } catch (err) {
    console.error("Create coupon error:", err);
    res.status(500).json({ message: "Failed to create coupon" });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_value,
      max_discount,
      expires_at,
      is_active,
    } = req.body;

    await db.query(
      `UPDATE coupons SET 
        code = ?, description = ?, discount_type = ?, discount_value = ?, 
        min_order_value = ?, max_discount = ?, expires_at = ?, is_active = ? 
       WHERE id = ?`,
      [
        code,
        description,
        discount_type,
        discount_value,
        min_order_value,
        max_discount,
        expires_at,
        is_active,
        id,
      ]
    );

    res.json({ message: "Coupon updated successfully" });
  } catch (err) {
    console.error("Update coupon error:", err);
    res.status(500).json({ message: "Failed to update coupon" });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM coupons WHERE id = ?", [id]);
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error("Delete coupon error:", err);
    res.status(500).json({ message: "Failed to delete coupon" });
  }
};

exports.toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("SELECT is_active FROM coupons WHERE id = ?", [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const currentStatus = result[0].is_active;
    const newStatus = !currentStatus;

    await db.query("UPDATE coupons SET is_active = ? WHERE id = ?", [newStatus, id]);
    res.json({ message: `Coupon ${newStatus ? 'activated' : 'deactivated'} successfully` });
  } catch (err) {
    console.error("Toggle coupon status error:", err);
    res.status(500).json({ message: "Failed to toggle coupon status" });
  }
};
