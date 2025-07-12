import React, { useEffect, useState, useCallback } from "react";
import styles from "./Styles/OrdersScreen.module.css";
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
  const [addressModal, setAddressModal] = useState({
    open: false,
    address: null,
  });

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`/admin/orders?${params}`);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchDeliveryUsers = async () => {
    try {
      const res = await API.get("/admin/orders/delivery-users");
      setDeliveryUsers(res.data);
    } catch (err) {
      console.error("Error fetching delivery users:", err);
    }
  };

  const assignDelivery = async () => {
    if (!selectedDelivery) return alert("Please select a delivery person");
    try {
      await API.patch(`/admin/orders/${selectedOrderId}/assign-delivery`, {
        delivery_person_id: selectedDelivery.id,
      });
      alert("Delivery person assigned");
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      console.error("Error assigning delivery:", error);
      alert("Error assigning delivery person");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className={styles.container}>
      <h2>Orders</h2>

      {/* Filters */}
      <div className={styles.filters}>
        <select
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
          placeholder="Search by user name"
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
        />

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
                <th>Delivery</th>
                <th>Assign</th>
                <th>Items</th>
                <th>Address</th>
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
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_name || "Guest"}</td>
                    <td>{order.status}</td>
                    <td>₹{total.toFixed(2)}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      {order.delivery_person_name ? (
                        <>
                          <p>{order.delivery_person_name}</p>
                          <p>{order.delivery_mobile}</p>
                        </>
                      ) : (
                        <em>Not assigned</em>
                      )}
                    </td>
                    <td>
                      {!order.delivery_person_name && (
                        <button
                          className={styles.assignBtn}
                          onClick={async () => {
                            setSelectedOrderId(order.id);
                            setSelectedDelivery(null);
                            await fetchDeliveryUsers();
                            setShowModal(true);
                          }}
                        >
                          Assign
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.viewItemsBtn}
                        onClick={() =>
                          setItemsModal({ open: true, items: parsedItems })
                        }
                      >
                        View Items
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.viewAddressBtn}
                        onClick={() => setAddressModal({ open: true, address })}
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

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Assign Delivery</h3>

            <select
              value={selectedDelivery?.id || ""}
              onChange={(e) => {
                const selected = deliveryUsers.find(
                  (d) => d.id === parseInt(e.target.value)
                );
                setSelectedDelivery(selected || null);
              }}
            >
              <option value="">Select Delivery Person</option>
              {deliveryUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.mobile})
                </option>
              ))}
            </select>

            {selectedDelivery && (
              <p style={{ marginTop: 10 }}>
                Mobile: <strong>{selectedDelivery.mobile}</strong>
              </p>
            )}

            <button onClick={assignDelivery}>Assign</button>
            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {itemsModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Order Items</h3>
            <ul>
              {itemsModal.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity} – ₹{item.price}
                </li>
              ))}
            </ul>
            <button
              className={styles.closeBtn}
              onClick={() => setItemsModal({ open: false, items: [] })}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {addressModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Address</h3>
            {addressModal.address ? (
              <p>
                {addressModal.address.house_block_no},{" "}
                {addressModal.address.area_road},<br />
                {addressModal.address.city}, {addressModal.address.district},
                <br />
                {addressModal.address.state} - {addressModal.address.pincode},
                <br />
                {addressModal.address.country}
              </p>
            ) : (
              <p>No address found</p>
            )}
            <button
              className={styles.closeBtn}
              onClick={() => setAddressModal({ open: false, address: null })}
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
