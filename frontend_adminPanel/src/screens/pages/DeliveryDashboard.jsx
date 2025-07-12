import React, { useEffect, useState } from "react";
import styles from "./Styles/DeliveryDashboard.module.css";
import API from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";

const DeliveryDashboard = () => {
  useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsModal, setItemsModal] = useState({ open: false, items: [] });
  const [addressModal, setAddressModal] = useState({
    open: false,
    address: null,
  });

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
    <div className={styles.container}>
      <h2>Your Assigned Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No assigned orders</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Status</th>
              <th>Total</th>
              <th>Items</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
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
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user_name || "Guest"}</td>
                  <td>{order.status}</td>
                  <td>₹{total.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() =>
                        setItemsModal({ open: true, items: parsedItems })
                      }
                    >
                      View Items
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => setAddressModal({ open: true, address })}
                    >
                      View Address
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      className={styles.deliveredBtn}
                    >
                      Delivered
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "help")}
                      className={styles.helpBtn}
                    >
                      Help
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {itemsModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Items</h3>
            <ul>
              {itemsModal.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity} – ₹{item.price}
                </li>
              ))}
            </ul>
            <button onClick={() => setItemsModal({ open: false, items: [] })}>
              Close
            </button>
          </div>
        </div>
      )}

      {addressModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Delivery Address</h3>
            <p>
              {addressModal.address.house_block_no},{" "}
              {addressModal.address.area_road},<br />
              {addressModal.address.city}, {addressModal.address.district},
              <br />
              {addressModal.address.state} - {addressModal.address.pincode},
              <br />
              {addressModal.address.country}
            </p>
            <button
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

export default DeliveryDashboard;
