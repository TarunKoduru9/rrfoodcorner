import React, { useEffect, useState, useCallback } from "react";
import API from "../../utils/api";

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", user: "", date: "" });

  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const [itemsModal, setItemsModal] = useState({ open: false, items: [] });
  const [addressModal, setAddressModal] = useState({ open: false, address: null });

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`/admin/orders?${params}`);
      setOrders(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchDeliveryUsers = async () => {
    try {
      const res = await API.get("/admin/orders/delivery-users");
      setDeliveryUsers(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Error fetching delivery users");
    }
  };

  const assignDelivery = async () => {
    if (!selectedDelivery) return alert("Select a delivery person");
    try {
      await API.patch(`/admin/orders/${selectedOrderId}/assign-delivery`, {
        delivery_person_id: selectedDelivery.id,
      });
      alert("Delivery person assigned");
      setShowModal(false);
      fetchOrders();
    } catch {
      alert("Assignment failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="preparing">Preparing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Search by user name"
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
        />

        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                {[
                  "Order ID",
                  "User",
                  "Status",
                  "Total",
                  "Created",
                  "Delivery",
                  "Assign",
                  "Items",
                  "Address",
                ].map((th) => (
                  <th key={th} className="px-4 py-2 border-b">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const total = parseFloat(order.total) || 0;
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
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.user_name || "Guest"}</td>
                    <td className="px-4 py-2 capitalize">{order.status}</td>
                    <td className="px-4 py-2">₹{total.toFixed(2)}</td>
                    <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      {order.delivery_person_name ? (
                        <>
                          <p>{order.delivery_person_name}</p>
                          <p>{order.delivery_mobile}</p>
                        </>
                      ) : (
                        <em className="text-gray-500">Not assigned</em>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {!order.delivery_person_name && (
                        <button
                          onClick={async () => {
                            setSelectedOrderId(order.id);
                            setSelectedDelivery(null);
                            await fetchDeliveryUsers();
                            setShowModal(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setItemsModal({ open: true, items: parsedItems })}
                        className="text-blue-600 underline"
                      >
                        View Items
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setAddressModal({ open: true, address })}
                        className="text-blue-600 underline"
                      >
                        View Address
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[400px] shadow-md">
            <h3 className="text-lg font-semibold mb-4">Assign Delivery</h3>

            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
              value={selectedDelivery?.id || ""}
              onChange={(e) =>
                setSelectedDelivery(
                  deliveryUsers.find((d) => d.id === parseInt(e.target.value)) || null
                )
              }
            >
              <option value="">Select Delivery Person</option>
              {deliveryUsers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.mobile})
                </option>
              ))}
            </select>

            {selectedDelivery && (
              <p className="mb-4 text-sm">Mobile: {selectedDelivery.mobile}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={assignDelivery}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Assign
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items Modal */}
      {itemsModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-md shadow-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {itemsModal.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity} – ₹{item.price}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setItemsModal({ open: false, items: [] })}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {addressModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-md shadow-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
            {addressModal.address ? (
              <p className="text-sm leading-6">
                {addressModal.address.house_block_no},{" "}
                {addressModal.address.area_road},<br />
                {addressModal.address.city}, {addressModal.address.district},<br />
                {addressModal.address.state} - {addressModal.address.pincode},<br />
                {addressModal.address.country}
              </p>
            ) : (
              <p className="text-gray-600">No address found</p>
            )}
            <button
              onClick={() => setAddressModal({ open: false, address: null })}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersScreen;
