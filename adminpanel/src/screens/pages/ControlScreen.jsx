import React, { useEffect, useState } from "react";
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
      setUsers(res.data.filter((u) => ["admin", "manager", "delivery"].includes(u.role)));
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
      await API.post("/admin/control/users", { ...form, email: form.email || null });
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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Control Panel</h2>

      {/* Manage Users */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4">1. Manage Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Name"
            className="border px-3 py-2 rounded"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleFormChange}
            placeholder="Email"
            className="border px-3 py-2 rounded"
          />
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleFormChange}
            placeholder="Mobile"
            className="border px-3 py-2 rounded"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleFormChange}
            placeholder="Password"
            type="password"
            className="border px-3 py-2 rounded"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <select
            name="role"
            value={form.role}
            onChange={handleFormChange}
            className="border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="delivery">Delivery</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSignup}
          >
            Create User
          </button>
        </div>

        <h4 className="font-medium text-lg mb-2">Existing Users</h4>
        {users.length === 0 ? (
          <p>No admins or managers yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Mobile</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="border px-4 py-2">{u.name}</td>
                    <td className="border px-4 py-2">{u.role}</td>
                    <td className="border px-4 py-2">{u.mobile}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permissions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. Role-Based Permissions</h3>
        {["admin", "manager"].map((role) => (
          <div key={role} className="mb-8">
            <h4 className="font-medium mb-2">{role.toUpperCase()}</h4>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Page</th>
                    <th className="border px-4 py-2">View</th>
                    <th className="border px-4 py-2">Create</th>
                    <th className="border px-4 py-2">Edit</th>
                    <th className="border px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {allPages.map((page) => {
                    const current = permissions.find(
                      (p) => p.role === role && p.page_key === page
                    ) || {};
                    return (
                      <tr key={`${role}-${page}`}>
                        <td className="border px-4 py-2">{page}</td>
                        {["can_view", "can_create", "can_edit", "can_delete"].map((key) => (
                          <td key={key} className="border px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={current[key] || false}
                              onChange={() => handlePermissionChange(role, page, key)}
                              className="cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={savePermissions}
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
};

export default ControlScreen;
