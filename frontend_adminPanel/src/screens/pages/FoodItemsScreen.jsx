import React, { useEffect, useState } from "react";
import styles from "./Styles/FoodItemsScreen.module.css";
import { BASE_URL } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";

const FoodItemsScreen = () => {
  const { user, loading: authLoading } = useAuth();
  const permissions = user?.permissions?.food_items || {};

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [itemCode, setItemCode] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [foodType, setFoodType] = useState("");
  const [comboType, setComboType] = useState("");
  const [price, setPrice] = useState("");
  const [subcontent, setSubcontent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const filteredItems = selectedCategoryId
    ? items.filter((item) => item.category_id === selectedCategoryId)
    : [];

  const fetchFoodItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/food-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data);
    } catch {
      alert("Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Unexpected response format");

      setCategories(data);

      const specialCat = data.find((cat) => cat.name === "FOOD CORNER SPECIAL");
      if (specialCat) {
        setSelectedCategoryId(specialCat.id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch categories: " + err.message);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFoodItems();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setItemCode("");
    setName("");
    setCategoryId("");
    setFoodType("");
    setComboType("");
    setPrice("");
    setSubcontent("");
    setImage(null);
    setPreview(null);
    setEditingId(null);
    setIsEdit(false);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!itemCode || !name || !categoryId || !price) {
      alert("Required fields missing");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${BASE_URL}/admin/food-items/${editingId}`
        : `${BASE_URL}/admin/food-items`;

      const formData = new FormData();
      formData.append("item_code", itemCode);
      formData.append("name", name);
      formData.append("category_id", categoryId);
      formData.append("food_type", foodType);
      formData.append("combo_type", comboType);
      formData.append("price", price);
      formData.append("subcontent", subcontent);
      if (image) formData.append("image", image);

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Submit failed");
      alert(isEdit ? "Updated" : "Created");
      fetchFoodItems();
      resetForm();
    } catch (e) {
      alert(e.message);
    }
  };

  const openEditModal = (item) => {
    setItemCode(item.item_code);
    setName(item.name);
    setCategoryId(item.category_id);
    setFoodType(item.food_type ?? "");
    setComboType(item.combo_type ?? "");
    setPrice(String(item.price));
    setSubcontent(item.subcontent ?? "");
    setImage(null);
    setPreview(BASE_URL + item.image_url);
    setEditingId(item.id);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete item?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/food-items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      alert("Deleted");
      fetchFoodItems();
    } catch (e) {
      alert(e.message);
    }
  };

  if (authLoading || loading || !user?.permissions) return <p>Loading...</p>;
  if (!permissions.can_view)
    return <p>Access denied for this page. Please contact admin.</p>;

  return (
    <div className={styles.container}>
      <h2>Food Items</h2>

      {permissions.can_create && (
        <button className={styles.addBtn} onClick={() => setModalVisible(true)}>
          + Add Food Item
        </button>
      )}

      <div className={styles.filter}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${
              selectedCategoryId === cat.id ? styles.selected : ""
            }`}
            onClick={() =>
              setSelectedCategoryId(
                selectedCategoryId === cat.id ? null : cat.id
              )
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      {selectedCategoryId == null ? (
        <p>Select a category</p>
      ) : filteredItems.length === 0 ? (
        <p>No items found</p>
      ) : (
        <div className={styles.list}>
          {filteredItems.map((item) => (
            <div className={styles.card} key={item.id}>
              <img
                src={BASE_URL + item.image_url}
                alt={item.name}
                className={styles.image}
              />
              <div className={styles.info}>
                <strong>{item.name}</strong>
                <span>
                  {item.item_code} - ₹{item.price}
                </span>
              </div>
              {permissions.can_edit && (
                <button
                  className={styles.editBtn}
                  onClick={() => openEditModal(item)}
                >
                  Edit
                </button>
              )}
              {permissions.can_delete && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {modalVisible && (permissions.can_create || permissions.can_edit) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{isEdit ? "Edit" : "Add"} Food Item</h3>
            <input
              type="text"
              placeholder="Item Code"
              className={styles.input}
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className={styles.input}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Food Type"
              className={styles.input}
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            />
            <input
              type="text"
              placeholder="Combo Type"
              className={styles.input}
              value={comboType}
              onChange={(e) => setComboType(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
              placeholder="Subcontent"
              className={styles.input}
              value={subcontent}
              onChange={(e) => setSubcontent(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <img src={preview} alt="preview" className={styles.preview} />
            )}
            <div className={styles.actions}>
              <button className={styles.saveBtn} onClick={handleSubmit}>
                Save
              </button>
              <button className={styles.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemsScreen;
