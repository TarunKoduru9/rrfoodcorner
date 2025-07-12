const db = require("../../config/db");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, mobile, role FROM users WHERE role IN ('admin', 'manager', 'delivery')`
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !mobile || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    } else {
      if (!password)
        return res.status(400).json({ message: "Password is required" });

      const hashed = await bcrypt.hash(password, 10);
      await db.query(
        `INSERT INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
        [name, email, mobile, hashed, role]
      );
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM users WHERE id = ?`, [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

exports.getRolePermissions = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM role_permissions`);
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching permissions", error: err.message });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    let permissions = [];

    if (Array.isArray(req.body.permissions)) {
      permissions = req.body.permissions;
    } else if (req.body.role && req.body.page_key) {
      permissions = [req.body]; 
    } else {
      return res.status(400).json({ message: 'Invalid request format' });
    }

    for (const p of permissions) {
      const { role, page_key, can_view, can_create, can_edit, can_delete } = p;

      if (!role || !page_key) {
        continue;
      }

      const [rows] = await db.query(
        `SELECT id FROM role_permissions WHERE role = ? AND page_key = ?`,
        [role, page_key]
      );

      if (rows.length > 0) {
        await db.query(
          `UPDATE role_permissions 
           SET can_view = ?, can_create = ?, can_edit = ?, can_delete = ? 
           WHERE role = ? AND page_key = ?`,
          [!!can_view, !!can_create, !!can_edit, !!can_delete, role, page_key]
        );
      } else {
        await db.query(
          `INSERT INTO role_permissions 
           (role, page_key, can_view, can_create, can_edit, can_delete)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [role, page_key, !!can_view, !!can_create, !!can_edit, !!can_delete]
        );
      }
    }

    res.json({ message: 'Permissions updated successfully' });
  } catch (err) {
    console.error('Error updating permissions:', err);
    res.status(500).json({ message: 'Error updating permissions', error: err.message });
  }
};


