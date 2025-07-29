import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/usersdata/with-orders");
      setUsers(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await API.delete(`/admin/usersdata/${id}`);
      alert(res.data.message);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Error deleting user");
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const res = await API.get(`/admin/usersdata/${userId}/orders`);
      setOrderHistory(res.data);
      setShowOrderModal(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Error fetching order history");
    }
  };

  const viewAddress = (user) => {
    if (user.address) {
      setSelectedUser(user);
      setSelectedAddress(user.address);
      setShowAddressModal(true);
    } else {
      alert("No address found for this user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users Who Placed Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Mobile</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Address</th>
                <th className="p-3 border">Orders</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{user.name}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.mobile}</td>
                  <td className="p-3 border">{user.role}</td>
                  <td className="p-3 border">{user.blocked ? "Blocked" : "Active"}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => viewAddress(user)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        fetchOrders(user.id);
                      }}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Order History - {selectedUser?.name}
            </h3>
            {orderHistory.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul className="space-y-4">
                {orderHistory.map((order) => (
                  <li key={order.id} className="border-b pb-4">
                    <p>Subtotal: ₹{order.subtotal}</p>
                    <p>Discount: ₹{order.discount}</p>
                    <p>Delivery: ₹{order.delivery_charge}</p>
                    <p>Taxes: ₹{order.taxes}</p>
                    <p>Total: ₹{order.total}</p>
                    <p>Status: {order.status}</p>
                    <p>
                      Created: {new Date(order.created_at).toLocaleString()}
                    </p>
                    {order.food_items?.length > 0 && (
                      <>
                        <p className="mt-2 font-medium">Items:</p>
                        <ul className="ml-4">
                          {order.food_items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 mb-1">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <span>
                                {item.name} × {item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowOrderModal(false)}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && selectedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Address - {selectedUser?.name}
            </h3>
            <p>House/Block No: {selectedAddress.house_block_no}</p>
            <p>Area/Road: {selectedAddress.area_road}</p>
            <p>City: {selectedAddress.city}</p>
            <p>District: {selectedAddress.district}</p>
            <p>State: {selectedAddress.state}</p>
            <p>Country: {selectedAddress.country}</p>
            <p>Pincode: {selectedAddress.pincode}</p>
            <button
              onClick={() => setShowAddressModal(false)}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersScreen;
