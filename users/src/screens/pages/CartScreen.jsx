import React, { useEffect, useState, useMemo } from "react";
import { useCart } from "../../utils/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const CartScreen = () => {
  const { cart, dispatch } = useCart();
  const cartItems = useMemo(() => cart.items || [], [cart.items]);
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [settings, setSettings] = useState({ delivery_charge: 0, taxes: 0 });
  const [exploreItems, setExploreItems] = useState([]);

  useEffect(() => {
    API.get("/auth/settings").then((res) => setSettings(res.data));
    const user = JSON.parse(localStorage.getItem("user"));
    const savedCoupon = JSON.parse(localStorage.getItem("selectedCoupon"));
    const savedAddress = JSON.parse(localStorage.getItem("selectedAddress"));
    if (user) setUserId(user.id);
    if (savedCoupon) setCoupon(savedCoupon);
    if (savedAddress) setSelectedAddress(savedAddress);
  }, []);

  useEffect(() => {
    if (!cartItems.length || !cartItems[0].category_id) return;
    API.get(`/auth/category/${cartItems[0].category_id}/items`).then((res) => {
      const filtered = res.data.filter(
        (i) => !cartItems.some((ci) => ci.id === i.id)
      );
      setExploreItems(filtered.slice(0, 10));
    });
  }, [cartItems]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );
  const discount = coupon
    ? coupon.discount_type === "flat"
      ? Number(coupon.discount_value)
      : Math.min(
          (subtotal * Number(coupon.discount_value)) / 100,
          Number(coupon.max_discount)
        )
    : 0;
  const deliveryCharge = Number(settings.delivery_charge) || 0;
  const taxAmount = Number(settings.taxes) || 0;
  const total = subtotal - discount + deliveryCharge + taxAmount;

  const handleOrder = async () => {
    if (!userId) return navigate("/");
    if (!selectedAddress) return alert("Please select an address.");

    try {
      await API.post("/auth/order", {
        user_id: userId,
        items: cartItems.map((item) => ({
          item_code: item.item_code,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          quantity: item.quantity,
        })),
        subtotal,
        discount,
        delivery_charge: deliveryCharge,
        taxes: taxAmount,
        total,
        address: selectedAddress,
      });

      localStorage.removeItem("selectedCoupon");
      localStorage.removeItem("selectedAddress");
      dispatch({ type: "CLEAR_CART" });
      navigate("/success");
    } catch (err) {
      alert(err?.response?.data?.message || "Order failed. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition cursor-pointer"
          onClick={() => navigate("/")}
        >
          Explore Items
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-2 bg-gradient-to-br from-slate-100 to-gray-100 pb-32">
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 left-0 z-20">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition cursor-pointer"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate">Cart</h1>
      </header>
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-white shadow-sm rounded-xl"
          >
            <img
              src={`${API.defaults.baseURL}${item.image_url}`}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex flex-col flex-grow">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-700">₹{item.price}</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() =>
                    dispatch({ type: "DECREMENT_QUANTITY", payload: item })
                  }
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                >
                  −
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch({ type: "INCREMENT_QUANTITY", payload: item })
                  }
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Address */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h4 className="font-bold mb-2">Delivery Address</h4>
        {!userId ? (
          <button
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login to set address
          </button>
        ) : !selectedAddress ? (
          <button
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate("/address")}
          >
            Set Address
          </button>
        ) : (
          <div className="text-sm text-gray-800">
            <p>
              {selectedAddress.house_block_no}, {selectedAddress.area_road}
            </p>
            <p>
              {selectedAddress.city}, {selectedAddress.state} -{" "}
              {selectedAddress.pincode}
            </p>
          </div>
        )}
      </div>

      {/* Coupon */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h4 className="font-bold mb-2">Coupon</h4>
        {coupon ? (
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-medium">{coupon.code}</span>
            <button
              onClick={() => {
                setCoupon(null);
                localStorage.removeItem("selectedCoupon");
              }}
              className="text-sm text-red-500 cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate("/coupons")}
          >
            Apply Coupon
          </button>
        )}
      </div>

      {/* Explore More */}
      {exploreItems.length > 0 && (
        <div className="mb-6">
          <h4 className="font-bold mb-3">Explore More</h4>
          <div className="flex gap-4 overflow-x-auto">
            {exploreItems.map((item) => (
              <div
                key={item.id}
                className="w-36 bg-white rounded-lg shadow p-2 flex-shrink-0"
              >
                <img
                  src={`${API.defaults.baseURL}${item.image_url}`}
                  alt={item.name}
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-sm font-medium mt-1 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">₹{item.price}</p>
                <button
                  className="mt-2 bg-blue-600 text-white w-full py-1 rounded hover:bg-blue-700 transition text-sm cursor-pointer"
                  onClick={() =>
                    dispatch({ type: "ADD_TO_CART", payload: item })
                  }
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bill Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h4 className="font-bold mb-3">Bill Summary</h4>
        <div className="text-sm space-y-1 text-gray-700">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Discount: -₹{discount.toFixed(2)}</p>
          <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
          <p>Tax: ₹{taxAmount.toFixed(2)}</p>
          <p className="font-semibold text-lg mt-2 text-black">
            Total: ₹{total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handleOrder}
        className="bg-green-600 text-white w-full py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition cursor-pointer"
      >
        {userId ? "Pay Now" : "Login to Pay"}
      </button>
    </div>
  );
};

export default CartScreen;
