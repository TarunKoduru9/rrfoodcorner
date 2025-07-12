import React, { useEffect, useState } from "react";
import styles from "./Styles/CategoriesScreen.module.css";
import { BASE_URL } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch categories.");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

if (authLoading || loading || !user?.permissions) return <p>Loading...</p>;
if (!permissions.can_view) return <p>Access denied for this page. Please contact admin.</p>;
;


  return (
    <div className={styles.container}>
      <h2>Categories</h2>

      {permissions.can_create && (
        <button className={styles.addBtn} onClick={() => setModalVisible(true)}>
          + Add Category
        </button>
      )}

      <div className={styles.list}>
        {categories.map((item) => (
          <div className={styles.card} key={item.id}>
            <img
              src={BASE_URL + item.catimage_url}
              alt={item.name}
              className={styles.image}
            />
            <span className={styles.name}>{item.name}</span>

            {permissions.can_edit && (
              <button onClick={() => openEditModal(item)} className={styles.editBtn}>
                Edit
              </button>
            )}

            {permissions.can_delete && (
              <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {modalVisible && (permissions.can_create || permissions.can_edit) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{isEdit ? "Edit" : "Add"} Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} className={styles.preview} alt="Preview" />}

            <div className={styles.actions}>
              <button onClick={handleSubmit} className={styles.saveBtn}>
                Save
              </button>
              <button onClick={resetForm} className={styles.cancelBtn}>
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
