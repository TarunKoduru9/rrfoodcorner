import React, { useEffect, useState } from "react";
import styles from "./Styles/CouponsScreen.module.css";
import API from "../../utils/api";

const initialForm = {
  code: "",
  description: "",
  discount_type: "flat",
  discount_value: "",
  min_order_value: "",
  max_discount: "",
  expires_at: "",
  is_active: true,
};

const CouponsScreen = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    delivery_charge: "",
    taxes: "",
  });

  const fetchSettings = async () => {
    try {
      const res = await API.get("/admin/settings");
      setSettings(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load settings");
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await API.get("/admin/coupons");
      setCoupons(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/admin/coupons/${editId}`, form);
        alert("Coupon updated");
      } else {
        await API.post("/admin/coupons", form);
        alert("Coupon created");
      }
      setForm(initialForm);
      setEditId(null);
      fetchCoupons();
    } catch (err) {
      alert(err?.response?.data?.message || "Error saving coupon");
    }
  };

  const handleEdit = (coupon) => {
    setForm({ ...coupon, expires_at: coupon.expires_at?.slice(0, 16) || "" });
    setEditId(coupon.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await API.delete(`/admin/coupons/${id}`);
        alert("Coupon deleted");
        fetchCoupons();
      } catch {
        alert("Failed to delete coupon");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.patch(`/admin/coupons/${id}/toggle`);
      fetchCoupons();
    } catch {
      alert("Failed to toggle status");
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put("/admin/settings", {
        delivery_charge: parseFloat(settings.delivery_charge),
        taxes: parseFloat(settings.taxes),
      });
      alert("Settings updated");
      fetchSettings();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update settings");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Coupons</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Code"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <select
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
        >
          <option value="flat">Flat</option>
          <option value="percent">Percent</option>
        </select>
        <input
          name="discount_value"
          value={form.discount_value}
          onChange={handleChange}
          type="number"
          placeholder="Discount Value"
          required
        />
        <input
          name="min_order_value"
          value={form.min_order_value}
          onChange={handleChange}
          type="number"
          placeholder="Min Order Value"
        />
        <input
          name="max_discount"
          value={form.max_discount}
          onChange={handleChange}
          type="number"
          placeholder="Max Discount"
        />
        <input
          name="expires_at"
          value={form.expires_at}
          onChange={handleChange}
          type="datetime-local"
        />
        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>
        <button type="submit">{editId ? "Update" : "Create"} Coupon</button>
      </form>

      {loading ? (
        <p>Loading coupons...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Max Discount</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.code}</td>
                  <td>
                    {coupon.discount_type === "flat"
                      ? `₹${coupon.discount_value}`
                      : `${coupon.discount_value}%`}
                  </td>
                  <td>₹{coupon.min_order_value}</td>
                  <td>
                    {coupon.max_discount ? `₹${coupon.max_discount}` : "-"}
                  </td>
                  <td>
                    {coupon.expires_at
                      ? new Date(coupon.expires_at).toLocaleString()
                      : "-"}
                  </td>
                  <td>{coupon.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(coupon)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleStatus(coupon.id)}
                      className={styles.toggleBtn}
                    >
                      {coupon.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Global Charges Settings</h2>

      <form className={styles.form} onSubmit={handleSettingsSubmit}>
        <input
          name="delivery_charge"
          value={settings.delivery_charge}
          onChange={handleSettingsChange}
          type="number"
          step="0.01"
          placeholder="Delivery Charge"
          required
        />
        <input
          name="taxes"
          value={settings.taxes}
          onChange={handleSettingsChange}
          type="number"
          step="0.01"
          placeholder="Taxes (%)"
          required
        />
        <button type="submit">Update Charges</button>
      </form>
    </div>
  );
};

export default CouponsScreen;
