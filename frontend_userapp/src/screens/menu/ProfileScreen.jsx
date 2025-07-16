import React, { useEffect, useState } from "react";
import { fetchMe, updateField } from "../../utils/api";
import GlobalCartPopup from "../../utils/GlobalCartPopup";
import BottomNavbar from "../../screens/pages/BottomNavbar";

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [editMode, setEditMode] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchMe();
        const userData = {
          name: data.name ?? "",
          email: data.email ?? "",
          mobile: data.mobile ? String(data.mobile) : "",
          password: "",
        };
        setFormData(userData);
        setOriginalData(userData);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Please login again.");
        window.location.href = "/login";
      }
    };

    loadUser();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "mobile" ? value.replace(/[^0-9]/g, "").slice(0, 10) : value,
    }));
  };

  const toggleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: originalData[field] ?? "",
    }));
    setEditMode((prev) => ({ ...prev, [field]: false }));
  };

  const handleUpdate = async (field) => {
    if (!formData[field]) return alert("Field cannot be empty.");
    setLoading(true);
    try {
      const result = await updateField(field, formData[field]);
      alert(result.message || "Updated successfully.");
      setOriginalData((prev) => ({ ...prev, [field]: formData[field] }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      console.error("Update error:", err);
      alert(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, field, secure = false) => (
    <div key={field} className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={secure ? "password" : "text"}
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        disabled={!editMode[field]}
        className={`w-full px-4 py-3 rounded-lg text-sm bg-gray-50 border outline-none transition ${
          editMode[field]
            ? "border-gray-400"
            : "border-gray-200 cursor-not-allowed"
        }`}
      />
      {!editMode[field] ? (
        <button
          onClick={() => toggleEdit(field)}
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Edit
        </button>
      ) : (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleUpdate(field)}
            disabled={loading}
            className={`flex-1 px-4 py-2 text-white text-sm rounded transition ${
              loading
                ? "bg-indigo-400 cursor-wait"
                : "bg-indigo-700 hover:bg-indigo-800 cursor-pointer"
            }`}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            onClick={() => handleCancel(field)}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-2 bg-gradient-to-br from-slate-100 to-gray-100 pb-32">
      <header className="flex justify-between items-center px-2 py-4 bg-white shadow-md sticky top-0 left-0 z-20">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition cursor-pointer"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate">Profile</h1>
      </header>
      <h2 className="text-2xl font-bold mt-2 mb-8 text-center text-gray-800">
        Edit Profile
      </h2>
      {renderField("Full Name", "name")}
      {renderField("Email", "email")}
      {renderField("Mobile", "mobile")}
      {renderField("Password", "password", true)}

      {loading && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Saving changes...
        </p>
      )}
      <GlobalCartPopup />
      <BottomNavbar />
    </div>
  );
};

export default ProfileScreen;
