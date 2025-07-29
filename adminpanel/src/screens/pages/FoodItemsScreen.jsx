import React, { useEffect, useState } from "react";
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

      const data = await res.json();
      setCategories(data);
      const special = data.find((cat) => cat.name === "FOOD CORNER SPECIAL");
      if (special) setSelectedCategoryId(special.id);
    } catch (err) {
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

  if (authLoading || loading || !user?.permissions) return <p className="p-4">Loading...</p>;
  if (!permissions.can_view) return <p className="p-4 text-red-500">Access denied</p>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Food Items</h2>

      {permissions.can_create && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => setModalVisible(true)}
        >
          + Add Food Item
        </button>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-3 py-1 rounded border ${
              selectedCategoryId === cat.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border rounded p-4 shadow hover:shadow-md transition"
            >
              <img
                src={BASE_URL + item.image_url}
                alt={item.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.item_code} – ₹{item.price}
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                {permissions.can_edit && (
                  <button
                    className="px-3 py-1 bg-yellow-400 text-black rounded"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </button>
                )}
                {permissions.can_delete && (
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              {isEdit ? "Edit" : "Add"} Food Item
            </h3>

            <div className="space-y-3">
              <input
                placeholder="Item Code"
                className="w-full border p-2 rounded"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value.toUpperCase())}
              />
              <input
                placeholder="Name"
                className="w-full border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
              />
              <select
                className="w-full border p-2 rounded"
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
                placeholder="Food Type"
                className="w-full border p-2 rounded"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value.toUpperCase())}
              />
              <input
                placeholder="Combo Type"
                className="w-full border p-2 rounded"
                value={comboType}
                onChange={(e) => setComboType(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full border p-2 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <textarea
                placeholder="Subcontent"
                className="w-full border p-2 rounded"
                value={subcontent}
                onChange={(e) => setSubcontent(e.target.value)}
              />
              <input type="file" onChange={handleFileChange} />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-full object-cover rounded mt-2"
                />
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Save
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={resetForm}
              >
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
