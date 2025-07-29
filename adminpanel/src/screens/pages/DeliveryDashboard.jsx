import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";

const DeliveryDashboard = () => {
  useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsModal, setItemsModal] = useState({ open: false, items: [] });
  const [addressModal, setAddressModal] = useState({ open: false, address: null });

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/delivery");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching delivery orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/admin/delivery/${id}/status`, { status });
      alert(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      console.error("Error updating status", err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Assigned Orders</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No assigned orders</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded shadow-sm">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">User</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Items</th>
                <th className="py-2 px-4 border">Address</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => {
                const subtotal = parseFloat(order.subtotal || 0);
                const tax = parseFloat(order.taxes || 0);
                const delivery = parseFloat(order.delivery_charge || 0);
                const discount = parseFloat(order.discount || 0);
                const total = subtotal + tax + delivery - discount;

                const parsedItems = Array.isArray(order.items)
                  ? order.items
                  : JSON.parse(order.items || "[]");

                const address = {
                  house_block_no: order.house_block_no,
                  area_road: order.area_road,
                  city: order.city,
                  district: order.district,
                  state: order.state,
                  country: order.country,
                  pincode: order.pincode,
                };

                return (
                  <tr key={order.id} className="text-center border-t">
                    <td className="py-2 px-4 border">{order.id}</td>
                    <td className="py-2 px-4 border">{order.user_name || "Guest"}</td>
                    <td className="py-2 px-4 border">{order.status}</td>
                    <td className="py-2 px-4 border">₹{total.toFixed(2)}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() =>
                          setItemsModal({ open: true, items: parsedItems })
                        }
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        View Items
                      </button>
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => setAddressModal({ open: true, address })}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        View Address
                      </button>
                    </td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => updateStatus(order.id, "delivered")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, "help")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Help
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Items Modal */}
      {itemsModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            <ul className="space-y-1 text-sm">
              {itemsModal.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity} – ₹{item.price}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setItemsModal({ open: false, items: [] })}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {addressModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
            <p className="text-sm leading-relaxed">
              {addressModal.address.house_block_no},{" "}
              {addressModal.address.area_road},<br />
              {addressModal.address.city}, {addressModal.address.district},<br />
              {addressModal.address.state} - {addressModal.address.pincode},<br />
              {addressModal.address.country}
            </p>
            <button
              onClick={() => setAddressModal({ open: false, address: null })}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
