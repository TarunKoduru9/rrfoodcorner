import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";

const CategoriesScreen = () => {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const permissions = user?.permissions?.categories || {};

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      setCategories(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setPreview(null);
    setIsEdit(false);
    setEditingId(null);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!name) return alert("Category name is required");

    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${BASE_URL}/admin/categories/${editingId}`
        : `${BASE_URL}/admin/categories`;

      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Upload failed");

      alert(isEdit ? "Updated successfully" : "Created successfully");
      fetchCategories();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (item) => {
    setName(item.name);
    setImage(null);
    setPreview(BASE_URL + item.catimage_url);
    setEditingId(item.id);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");
      alert("Category deleted.");
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading || !user?.permissions)
    return <p className="p-6 text-center">Loading...</p>;

  if (!permissions.can_view)
    return (
      <p className="p-6 text-red-500 text-center">
        Access denied. Please contact admin.
      </p>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-0">
        <h2 className="text-2xl font-bold">Categories</h2>
        {permissions.can_create && (
          <button
            onClick={() => setModalVisible(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg cursor-pointer transition"
          >
            + Add Category
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-lg shadow-sm p-3 flex flex-col items-center text-center"
          >
            <img
              src={BASE_URL + item.catimage_url}
              alt={item.name}
              className="w-full h-28 object-cover rounded-md mb-2"
            />
            <span className="font-medium mb-2">{item.name}</span>

            <div className="flex gap-3 mt-auto">
              {permissions.can_edit && (
                <button
                  onClick={() => openEditModal(item)}
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                >
                  Edit
                </button>
              )}
              {permissions.can_delete && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-500 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalVisible && (permissions.can_create || permissions.can_edit) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl relative">
            <h3 className="text-lg font-semibold mb-4">
              {isEdit ? "Edit" : "Add"} Category
            </h3>
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded cursor-pointer"
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

export default CategoriesScreen;
