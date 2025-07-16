import React, { useEffect, useState } from "react";
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
    <div className="p-4 sm:p-6 lg:p-10 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Coupons</h2>

      {/* Coupon Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10"
      >
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Code"
          required
          className="border px-4 py-2 rounded"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border px-4 py-2 rounded"
        />
        <select
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        >
          <option value="flat">Flat</option>
          <option value="percent">Percent</option>
        </select>
        <input
          name="discount_value"
          type="number"
          value={form.discount_value}
          onChange={handleChange}
          placeholder="Discount Value"
          className="border px-4 py-2 rounded"
          required
        />
        <input
          name="min_order_value"
          type="number"
          value={form.min_order_value}
          onChange={handleChange}
          placeholder="Min Order Value"
          className="border px-4 py-2 rounded"
        />
        <input
          name="max_discount"
          type="number"
          value={form.max_discount}
          onChange={handleChange}
          placeholder="Max Discount"
          className="border px-4 py-2 rounded"
        />
        <input
          name="expires_at"
          type="datetime-local"
          value={form.expires_at}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="cursor-pointer"
          />
          Active
        </label>
        <div className="sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {editId ? "Update" : "Create"} Coupon
          </button>
        </div>
      </form>

      {/* Coupons Table */}
      {loading ? (
        <p>Loading coupons...</p>
      ) : (
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Discount</th>
                <th className="px-4 py-2 text-left">Min Order</th>
                <th className="px-4 py-2 text-left">Max Discount</th>
                <th className="px-4 py-2 text-left">Expires</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t">
                  <td className="px-4 py-2">{coupon.code}</td>
                  <td className="px-4 py-2">
                    {coupon.discount_type === "flat"
                      ? `₹${coupon.discount_value}`
                      : `${coupon.discount_value}%`}
                  </td>
                  <td className="px-4 py-2">₹{coupon.min_order_value}</td>
                  <td className="px-4 py-2">
                    {coupon.max_discount ? `₹${coupon.max_discount}` : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {coupon.expires_at
                      ? new Date(coupon.expires_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-sm font-medium ${
                        coupon.is_active ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleStatus(coupon.id)}
                      className="text-yellow-600 hover:underline"
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

      {/* Global Settings */}
      <h2 className="text-2xl font-bold mb-4">Global Charges Settings</h2>
      <form
        onSubmit={handleSettingsSubmit}
        className="grid sm:grid-cols-2 gap-4 max-w-xl"
      >
        <input
          name="delivery_charge"
          type="number"
          step="0.01"
          value={settings.delivery_charge}
          onChange={handleSettingsChange}
          placeholder="Delivery Charge"
          className="border px-4 py-2 rounded"
          required
        />
        <input
          name="taxes"
          type="number"
          step="0.01"
          value={settings.taxes}
          onChange={handleSettingsChange}
          placeholder="Taxes (%)"
          className="border px-4 py-2 rounded"
          required
        />
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Update Charges
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponsScreen;
