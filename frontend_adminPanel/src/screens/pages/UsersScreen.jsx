import React, { useEffect, useState } from "react";
import styles from "./Styles/UsersScreen.module.css";
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
    <div className={styles.container}>
      <h2>Users Who Placed Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Address</th>
                <th>Orders</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.role}</td>
                  <td>{user.blocked ? "Blocked" : "Active"}</td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => viewAddress(user)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => {
                        setSelectedUser(user);
                        fetchOrders(user.id);
                      }}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteUser(user.id)}
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

      {showOrderModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Order History - {selectedUser?.name}</h3>
            {orderHistory.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul className={styles.orderList}>
                {orderHistory.map((order) => (
                  <li key={order.id}>
                    <p>
                      <strong>Subtotal:</strong> ₹{order.subtotal}
                    </p>
                    <p>
                      <strong>Discount:</strong> ₹{order.discount}
                    </p>
                    <p>
                      <strong>Delivery:</strong> ₹{order.delivery_charge}
                    </p>
                    <p>
                      <strong>Taxes:</strong> ₹{order.taxes}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{order.total}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>

                    {order.food_items?.length > 0 && (
                      <>
                        <p>
                          <strong>Items:</strong>
                        </p>
                        <ul className={styles.foodItemList}>
                          {order.food_items.map((item, idx) => (
                            <li key={idx} className={styles.foodItem}>
                              <img
                                src={item.image}
                                alt={item.name}
                                className={styles.foodImage}
                              />
                              <span>
                                {item.name} × {item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <hr />
                  </li>
                ))}
              </ul>
            )}
            <button
              className={styles.closeBtn}
              onClick={() => setShowOrderModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAddressModal && selectedAddress && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Address - {selectedUser?.name}</h3>
            <p>
              <strong>House/Block No:</strong> {selectedAddress.house_block_no}
            </p>
            <p>
              <strong>Area/Road:</strong> {selectedAddress.area_road}
            </p>
            <p>
              <strong>City:</strong> {selectedAddress.city}
            </p>
            <p>
              <strong>District:</strong> {selectedAddress.district}
            </p>
            <p>
              <strong>State:</strong> {selectedAddress.state}
            </p>
            <p>
              <strong>Country:</strong> {selectedAddress.country}
            </p>
            <p>
              <strong>Pincode:</strong> {selectedAddress.pincode}
            </p>
            <button
              className={styles.closeBtn}
              onClick={() => setShowAddressModal(false)}
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
