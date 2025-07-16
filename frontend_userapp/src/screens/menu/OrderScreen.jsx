import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { useCart } from "../../utils/CartContext";
import GlobalCartPopup from "../../utils/GlobalCartPopup";
import BottomNavbar from "../../screens/pages/BottomNavbar";

const OrderScreen = () => {
  const { dispatch } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem("user");
        if (!userData) return;

        const userId = JSON.parse(userData).id;
        const res = await API.get(`/auth/order/${userId}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReorder = (item) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...item,
        quantity: 1,
        category_id: item.category_id || null,
        item_code: item.item_code || "",
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="text-gray-600 text-lg animate-pulse">
          Loading orders...
        </span>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">No past orders found.</p>
      </div>
    );
  }

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
        <h1 className="text-lg font-bold text-gray-800 truncate">Orders</h1>
      </header>
      <h2 className="text-2xl font-bold mb-6 mt-1 text-gray-800">Your Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => {
          const orderItems = Array.isArray(order.items)
            ? order.items
            : (() => {
                try {
                  return JSON.parse(order.items || "[]");
                } catch {
                  return [];
                }
              })();

          const orderDate = order.date
            ? new Date(order.date).toLocaleString()
            : "Unknown date";
          const status = order.status || "Processing";

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"
            >
              <div className="mb-2 text-sm text-gray-600">
                <strong>Date:</strong> {orderDate}
              </div>
              <div className="mb-4 text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    status === "Delivered"
                      ? "text-green-600"
                      : status === "Cancelled"
                      ? "text-red-500"
                      : "text-yellow-600"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="space-y-4">
                {orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 border-b pb-4 last:border-none"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={
                          item.image_url
                            ? `${API.defaults.baseURL}${item.image_url}`
                            : "/placeholder.jpg"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="flex flex-col ">
                        <span className="font-semibold text-gray-800">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          ₹{item.price} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReorder(item)}
                      className="bg-black text-white text-sm px-4 py-1.5 rounded hover:bg-gray-800 transition cursor-pointer"
                    >
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <GlobalCartPopup />
      <BottomNavbar />
    </div>
  );
};

export default OrderScreen;
