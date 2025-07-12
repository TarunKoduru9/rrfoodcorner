const db = require("../../config/db");

exports.getAssignedOrders = async (req, res) => {
  const userId = req.user.id; 

  try {
    const [orders] = await db.query(
      `
      SELECT 
        o.*, 
        u.name AS user_name, 
        d.status AS delivery_status,
        a.house_block_no, a.area_road, a.city, a.district, a.state, a.country, a.pincode
      FROM order_status o
      JOIN deliveries d ON o.id = d.order_id
      JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses a ON o.user_id = a.user_id
      WHERE d.delivery_person_id = ?
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    res.json(orders);
  } catch (err) {
    console.error("Error fetching assigned orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

exports.updateStatus = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  if (!["delivered", "help"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [[orderCheck]] = await db.query(
      `SELECT * FROM deliveries WHERE order_id = ? AND delivery_person_id = ?`,
      [id, userId]
    );

    if (!orderCheck) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    await db.query(
      `UPDATE deliveries SET status = ?, delivered_at = CURRENT_TIMESTAMP WHERE order_id = ?`,
      [status, id]
    );

    await db.query(
      `UPDATE order_status SET status = ? WHERE id = ?`,
      [status, id]
    );

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({ message: "Error updating status" });
  }
};
