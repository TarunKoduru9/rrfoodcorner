const db = require('../../config/db');

exports.getAllOrders = async (req, res) => {
  const { status, from, to, user_id } = req.query;
  let conditions = [], values = [];

  if (status) {
    conditions.push("o.status = ?");
    values.push(status);
  }
  if (from && to) {
    conditions.push("DATE(o.created_at) BETWEEN ? AND ?");
    values.push(from, to);
  }
  if (user_id) {
    conditions.push("o.user_id = ?");
    values.push(user_id);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const [orders] = await db.query(`
      SELECT 
        o.*,
        u.name AS user_name, u.email AS user_email, u.mobile AS user_mobile,
        du.name AS delivery_person_name, du.mobile AS delivery_mobile,
        d.status AS delivery_status, d.assigned_at, d.delivered_at,
        a.house_block_no, a.area_road, a.city, a.district, a.state, a.country, a.pincode
      FROM order_status o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN deliveries d ON o.id = d.order_id
      LEFT JOIN users du ON d.delivery_person_id = du.id
      LEFT JOIN (
        SELECT * FROM addresses WHERE id IN (
          SELECT MAX(id) FROM addresses GROUP BY user_id
        )
      ) a ON o.user_id = a.user_id
      ${whereClause}
      ORDER BY o.created_at DESC
    `, values);

    for (let order of orders) {
      const parsed = Array.isArray(order.items)
        ? order.items
        : JSON.parse(order.items || '[]');

      const itemCodes = parsed.map(i => i.item_code);
      order.items = [];

      if (itemCodes.length) {
        const [foods] = await db.query(
          `SELECT item_code, name, price FROM food_items WHERE item_code IN (?)`,
          [itemCodes]
        );

        const fmap = foods.reduce((acc, f) => {
          acc[f.item_code] = f;
          return acc;
        }, {});

        order.items = parsed.map(i => ({
          item_code: i.item_code,
          quantity: i.quantity,
          name: fmap[i.item_code]?.name || i.name || "Unknown",
          price: fmap[i.item_code]?.price || i.price || 0,
          total: ((fmap[i.item_code]?.price || i.price || 0) * i.quantity).toFixed(2),
        }));
      }
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


exports.assignDelivery = async (req, res) => {
  const { id } = req.params;
  const { delivery_person_id } = req.body;

  if (!delivery_person_id) {
    return res.status(400).json({ message: 'Delivery person ID is required' });
  }

  try {
    const [[deliveryPerson]] = await db.query(
      `SELECT id FROM users WHERE id = ? AND role = 'delivery'`,
      [delivery_person_id]
    );

    if (!deliveryPerson) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }

    const [existing] = await db.query(
      `SELECT * FROM deliveries WHERE order_id = ?`,
      [id]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE deliveries 
         SET delivery_person_id = ?, status = 'assigned', assigned_at = CURRENT_TIMESTAMP 
         WHERE order_id = ?`,
        [delivery_person_id, id]
      );
    } else {
      await db.query(
        `INSERT INTO deliveries (order_id, delivery_person_id, status) 
         VALUES (?, ?, 'assigned')`,
        [id, delivery_person_id]
      );
    }

    res.json({ message: 'Delivery assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error assigning delivery' });
  }
};

exports.getDeliveryUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, mobile FROM users WHERE role = 'delivery'`
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching delivery users' });
  }
};
