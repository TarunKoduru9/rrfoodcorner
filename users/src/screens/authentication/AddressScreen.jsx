import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const initialForm = {
  house_block_no: "",
  area_road: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pincode: "",
};

const AddressScreen = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/address");
      setAddresses(res.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingAddressId) {
        await API.put(`/auth/address/${editingAddressId}`, form);
      } else {
        await API.post("/auth/address", form);
      }
      setShowForm(false);
      setForm(initialForm);
      setEditingAddressId(null);
      fetchAddresses();
    } catch (err) {
      console.error("Address save error:", err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await API.delete(`/auth/address/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const startEdit = (item) => {
    setForm(item);
    setShowForm(true);
    setEditingAddressId(item.id);
  };

  const handleConfirmOrder = () => {
    const selected = addresses.find((a) => a.id === selectedAddressId);
    if (selected) {
      localStorage.setItem("selectedAddress", JSON.stringify(selected));
      navigate(-1);
    }
  };

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
        <h1 className="text-lg font-bold text-gray-800 truncate">Addresses</h1>
      </header>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Addresses</h2>
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setForm(initialForm);
            setEditingAddressId(null);
          }}
          className="bg-indigo-900 hover:bg-indigo-800 text-white font-semibold px-4 py-2 rounded mb-4 w-full transition cursor-pointer"
        >
          + Add New Address
        </button>
      )}
      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-6">
          {Object.keys(initialForm).map((key) => (
            <input
              key={key}
              placeholder={key.replace(/_/g, " ")}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-sm focus:outline-indigo-600"
            />
          ))}
          <button
            onClick={handleSubmit}
            className="bg-indigo-900 hover:bg-indigo-800 text-white font-semibold px-4 py-2 rounded w-full transition cursor-pointer"
          >
            {editingAddressId ? "Update Address" : "Save Address"}
          </button>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Saved Addresses
      </h3>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {addresses.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAddressId(item.id)}
              className={`bg-white p-4 rounded border mb-4 transition cursor-pointer ${
                selectedAddressId === item.id
                  ? "border-indigo-900 border-2"
                  : "border-gray-200"
              }`}
            >
              <p>
                {item.house_block_no}, {item.area_road}
              </p>
              <p>
                {item.city}, {item.district}
              </p>
              <p>
                {item.state}, {item.country} - {item.pincode}
              </p>

              <div className="flex justify-end gap-4 mt-2 text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(item);
                  }}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(item.id);
                  }}
                  className="text-red-600 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {selectedAddressId && (
        <button
          onClick={handleConfirmOrder}
          className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold w-full py-3 rounded mt-6 transition cursor-pointer"
        >
          Confirm and Proceed
        </button>
      )}
    </div>
  );
};

export default AddressScreen;
