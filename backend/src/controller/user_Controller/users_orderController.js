const db = require("../../config/db");

const placeOrder = async (req, res) => {
  const {
    user_id,
    items,
    subtotal,
    discount,
    delivery_charge,
    taxes,
    total,
    address,
  } = req.body;

  try {
    // STEP 1: Handle address (unchanged)
    const [existingAddressRows] = await db.query(
      `SELECT id FROM addresses 
       WHERE user_id = ? AND 
             house_block_no = ? AND 
             area_road = ? AND 
             city = ? AND 
             district = ? AND 
             state = ? AND 
             country = ? AND 
             pincode = ?`,
      [
        user_id,
        address.house_block_no,
        address.area_road,
        address.city,
        address.district,
        address.state,
        address.country,
        address.pincode,
      ]
    );

    let address_id;

    if (existingAddressRows.length > 0) {
      address_id = existingAddressRows[0].id;
    } else {
      const [insertResult] = await db.query(
        `INSERT INTO addresses 
         (user_id, house_block_no, area_road, city, district, state, country, pincode)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          address.house_block_no,
          address.area_road,
          address.city,
          address.district,
          address.state,
          address.country,
          address.pincode,
        ]
      );
      address_id = insertResult.insertId;
    }

    // STEP 2: Enrich items with food item IDs
    const itemNames = items.map((item) => item.name);
    const [foodRows] = await db.query(
      `SELECT id, name FROM food_items WHERE name IN (?)`,
      [itemNames]
    );

    const nameToIdMap = {};
    foodRows.forEach((row) => {
      nameToIdMap[row.name] = row.id;
    });

    const enrichedItems = items.map((item) => ({
      ...item,
      id: nameToIdMap[item.name] || null, // set to null if not found
    }));

    // Optional: Validate if any id is missing
    const missingItems = enrichedItems.filter((item) => item.id === null);
    if (missingItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more items could not be matched with an ID",
        missingItems,
      });
    }

    // STEP 3: Save order
    const [orderResult] = await db.query(
      `INSERT INTO order_status 
       (user_id, items, subtotal, discount, delivery_charge, taxes, total, address_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        JSON.stringify(enrichedItems),
        subtotal,
        discount,
        delivery_charge,
        taxes,
        total,
        address_id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order_id: orderResult.insertId,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const [orders] = await db.query(
      `SELECT id, items, subtotal, total, status, created_at as date
       FROM order_status
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ orders });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = {
  placeOrder,
  getOrdersByUser,
};


