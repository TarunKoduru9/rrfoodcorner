const db = require('../../config/db');

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.getUsersWithOrders = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT DISTINCT 
        u.id, u.name, u.email, u.mobile, u.role, u.blocked, u.created_at,
        a.house_block_no, a.area_road, a.city, a.district, a.state, a.country, a.pincode
      FROM users u
      JOIN order_status o ON u.id = o.user_id
      LEFT JOIN addresses a ON u.id = a.user_id
    `);

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      blocked: user.blocked,
      created_at: user.created_at,
      address: user.house_block_no ? {
        house_block_no: user.house_block_no,
        area_road: user.area_road,
        city: user.city,
        district: user.district,
        state: user.state,
        country: user.country,
        pincode: user.pincode,
      } : null
    }));

    res.json(formattedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users with orders' });
  }
};

exports.getUserOrders = async (req, res) => {
  const { id } = req.params;

  try {
    const [orders] = await db.query(
      `SELECT * FROM order_status WHERE user_id = ? ORDER BY created_at DESC`,
      [id]
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    const foodItemIds = [];
    const parsedOrders = orders.map(order => {
      let parsedItems = [];

      try {
        parsedItems = JSON.parse(order.items || "[]");

        if (!Array.isArray(parsedItems)) {
          parsedItems = [];
        }

        parsedItems.forEach(i => {
          if (i?.id) foodItemIds.push(i.id);
        });
      } catch (e) {
        console.warn("Failed to parse items for order", order.id);
      }

      return { ...order, parsedItems };
    });

    if (foodItemIds.length === 0) {
      return res.json(orders.map(order => ({ ...order, food_items: [] })));
    }

    const uniqueIds = [...new Set(foodItemIds)];
    const placeholders = uniqueIds.map(() => '?').join(',');
    const [foodItems] = await db.query(
      `SELECT id, name, image_url FROM food_items WHERE id IN (${placeholders})`,
      uniqueIds
    );

    const foodMap = {};
    foodItems.forEach(item => {
      foodMap[item.id] = {
        name: item.name,
        image: item.image_url
      };
    });

    const enrichedOrders = parsedOrders.map(order => ({
      ...order,
      food_items: order.parsedItems.map(i => ({
        name: foodMap[i.id]?.name || "Unknown Item",
        image: foodMap[i.id]?.image || "",
        quantity: i.quantity || 0
      }))
    }));

    res.json(enrichedOrders);
  } catch (err) {
    console.error("Error in getUserOrders:", err);
    res.status(500).json({ message: "Error fetching user orders" });
  }
};






