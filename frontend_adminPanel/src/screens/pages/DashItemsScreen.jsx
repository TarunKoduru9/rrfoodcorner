import React, { useEffect, useState } from "react";
import API, { BASE_URL } from "../../utils/api";

const DashItemsScreen = () => {
  const [categories, setCategories] = useState([]);
  const [dashItems, setDashItems] = useState({});
  const [foodItems, setFoodItems] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [editingKeywordId, setEditingKeywordId] = useState(null);
  const [editingKeywordName, setEditingKeywordName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await API.get("/admin/categories");
      setCategories(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch categories.");
    }
  };

  const fetchDashItems = async () => {
    try {
      const res = await API.get("/admin/dashitem/whatsnew");
      const mapped = {};
      res.data.forEach((item) => {
        mapped[item.category_id] = item.food_item_id;
      });
      setDashItems(mapped);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch dash items.");
    }
  };

  const fetchFoodItemsByCategory = async (categoryId) => {
    if (foodItems[categoryId]) return;
    try {
      const res = await API.get(`/admin/dashitem/fornew-food-items/${categoryId}`);
      setFoodItems((prev) => ({ ...prev, [categoryId]: res.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch food items");
    }
  };

  const saveDashItem = async (categoryId, foodItemId) => {
    try {
      setSaving(true);
      await API.post("/admin/dashitem/whatsnew", {
        category_id: categoryId,
        food_item_id: foodItemId,
      });
      alert("Saved!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const fetchKeywords = async () => {
    try {
      const res = await API.get("/admin/keywords");
      setKeywords(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load keywords");
    }
  };

  const addKeyword = async () => {
    if (!newKeyword.trim()) return alert("Enter keyword");
    try {
      const res = await API.post("/admin/keywords", { name: newKeyword });
      setKeywords([...keywords, res.data]);
      setNewKeyword("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add keyword");
    }
  };

  const deleteKeyword = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await API.delete(`/admin/keywords/${id}`);
      setKeywords(keywords.filter((k) => k.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const startEditing = (keyword) => {
    setEditingKeywordId(keyword.id);
    setEditingKeywordName(keyword.name);
  };

  const saveEditedKeyword = async () => {
    try {
      await API.put(`/admin/keywords/${editingKeywordId}`, {
        name: editingKeywordName,
      });
      const updated = keywords.map((k) =>
        k.id === editingKeywordId ? { ...k, name: editingKeywordName } : k
      );
      setKeywords(updated);
      setEditingKeywordId(null);
      setEditingKeywordName("");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update");
    }
  };

  useEffect(() => {
    Promise.all([fetchCategories(), fetchDashItems(), fetchKeywords()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) return <p className="p-6 text-center text-lg">Loading...</p>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-10">
      {/* What's New Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Manage What's New Dashboard Items</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const selectedItem = foodItems[cat.id]?.find(
              (item) => item.id === parseInt(dashItems[cat.id])
            );

            return (
              <div key={cat.id} className="border rounded p-4 shadow-sm bg-white">
                <strong className="block mb-2">{cat.name}</strong>
                <select
                  className="w-full border p-2 rounded mb-3"
                  value={dashItems[cat.id] || ""}
                  onClick={() => fetchFoodItemsByCategory(cat.id)}
                  onChange={(e) =>
                    setDashItems((prev) => ({
                      ...prev,
                      [cat.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Select Item --</option>
                  {(foodItems[cat.id] || []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (₹{item.price})
                    </option>
                  ))}
                </select>

                {selectedItem && (
                  <img
                    src={BASE_URL + selectedItem.image_url}
                    alt={selectedItem.name}
                    className="w-full h-24 object-cover rounded mb-3"
                  />
                )}

                <button
                  onClick={() => saveDashItem(cat.id, dashItems[cat.id])}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keywords Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Keywords</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value.toUpperCase())}
            placeholder="New Keyword"
            className="border px-3 py-2 rounded w-full sm:w-auto flex-grow sm:flex-grow-0"
          />
          <button
            onClick={addKeyword}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Keyword
          </button>
        </div>

        <ul className="space-y-2">
          {keywords.map((k) => (
            <li
              key={k.id}
              className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 rounded"
            >
              {editingKeywordId === k.id ? (
                <>
                  <input
                    value={editingKeywordName}
                    onChange={(e) => setEditingKeywordName(e.target.value.toUpperCase())}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    onClick={saveEditedKeyword}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-grow">{k.name}</span>
                  <button
                    onClick={() => startEditing(k)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteKeyword(k.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashItemsScreen;
