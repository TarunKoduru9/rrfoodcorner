import React, { useEffect, useState } from "react";
import styles from "./Styles/DashItemScreen.module.css";
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
      const res = await API.get(
        `/admin/dashitem/fornew-food-items/${categoryId}`
      );
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
    Promise.all([fetchCategories(), fetchDashItems(), fetchKeywords()]).finally(
      () => setLoading(false)
    );
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div>
        <h2>Manage What's New Dashboard Items</h2>
        <div className={styles.list}>
          {categories.map((cat) => {
            const selectedItem = foodItems[cat.id]?.find(
              (item) => item.id === parseInt(dashItems[cat.id])
            );

            return (
              <div className={styles.card} key={cat.id}>
                <strong>{cat.name}</strong>

                <select
                  className={styles.input}
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
                    <option key={item.id} value={item.id} title={item.name}>
                      {item.name} (${item.price})
                    </option>
                  ))}
                </select>

                {selectedItem && (
                  <img
                    src={BASE_URL + selectedItem.image_url}
                    alt={selectedItem.name}
                    className={styles.preview}
                    style={{
                      marginTop: "10px",
                      height: "100px",
                      borderRadius: "10px",
                    }}
                  />
                )}

                <button
                  className={styles.saveBtn}
                  style={{ marginTop: 10 }}
                  onClick={() => saveDashItem(cat.id, dashItems[cat.id])}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 style={{ marginTop: 40 }}>Manage Keywords</h2>
        <div className={styles.keywords}>
          <input
            className={styles.input}
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="New Keyword"
          />
          <button className={styles.saveBtn} onClick={addKeyword}>
            Add Keyword
          </button>

          <ul className={styles.keywordList}>
            {keywords.map((k) => (
              <li key={k.id} className={styles.keywordItem}>
                {editingKeywordId === k.id ? (
                  <>
                    <input
                      className={styles.input}
                      value={editingKeywordName}
                      onChange={(e) => setEditingKeywordName(e.target.value)}
                    />
                    <button
                      className={styles.saveBtn}
                      onClick={saveEditedKeyword}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span>{k.name}</span>
                    <button onClick={() => startEditing(k)}>Edit</button>
                    <button onClick={() => deleteKeyword(k.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashItemsScreen;
