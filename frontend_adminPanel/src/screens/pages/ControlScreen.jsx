import React, { useEffect, useState } from "react";
import styles from "./Styles/ControlScreen.module.css";
import API from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";

const ControlScreen = () => {
  useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "admin",
  });
  const [permissions, setPermissions] = useState([]);
  const [allPages] = useState([
    "categories",
    "food_items",
    "orders",
    "coupons",
    "usersdata",
    "newsection",
    "feedback",
    "delivery",
  ]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/control/users");
      setUsers(
        res.data.filter((u) =>
          ["admin", "manager", "delivery"].includes(u.role)
        )
      );
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users");
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await API.get("/admin/control/permissions");
      setPermissions(res.data);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      alert("Failed to fetch permissions");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSignup = async () => {
  if (!form.name || !form.mobile || !form.password) {
    return alert("Please fill required fields");
  }

  try {
    const payload = {
      name: form.name,
      email: form.email || null,
      mobile: form.mobile,
      password: form.password,
      role: form.role,
    };

    await API.post("/admin/control/users", payload);
    alert("User created successfully");
    fetchUsers(); 
    setForm({ name: "", email: "", mobile: "", password: "", role: "admin" });
  } catch (err) {
    alert(err?.response?.data?.message || "Failed to create user");
  }
};


  const handlePermissionChange = (role, page, key) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.role === role && p.page_key === page ? { ...p, [key]: !p[key] } : p
      )
    );
  };

  const savePermissions = async () => {
    try {
      await API.post("/admin/control/permissions", { permissions });
      alert("Permissions updated!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update permissions");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/control/users/${userId}`);
      alert("User deleted");
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Control Panel</h2>

      <div className={styles.section}>
        <h3>1. Manage Users</h3>
        <input
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Name"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Email"
        />
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleFormChange}
          placeholder="Mobile"
        />
        <input
          name="password"
          value={form.password}
          onChange={handleFormChange}
          placeholder="Password"
          type="password"
        />
        <select name="role" value={form.role} onChange={handleFormChange}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="delivery">Delivery</option>
        </select>
        <button onClick={handleSignup}>Create User</button>

        <h4>Existing Users</h4>
        {users.length === 0 ? (
          <p>No admins or managers yet</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>{u.mobile}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(u.id)}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.section}>
        <h3>2. Role-Based Permissions</h3>
        {["admin", "manager"].map((role) => (
          <div key={role}>
            <h4>{role.toUpperCase()}</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>View</th>
                  <th>Create</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {allPages.map((page) => {
                  const current =
                    permissions.find(
                      (p) => p.role === role && p.page_key === page
                    ) || {};
                  return (
                    <tr key={`${role}-${page}`}>
                      <td>{page}</td>
                      {["can_view", "can_create", "can_edit", "can_delete"].map(
                        (key) => (
                          <td key={key}>
                            <input
                              type="checkbox"
                              checked={current[key] || false}
                              onChange={() =>
                                handlePermissionChange(role, page, key)
                              }
                            />
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
        <button onClick={savePermissions}>Save Permissions</button>
      </div>
    </div>
  );
};

export default ControlScreen;
