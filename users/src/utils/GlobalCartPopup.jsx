import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const HIDDEN_ROUTES = ["/cart", "/coupons"];

const GlobalCartPopup = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const shouldHide = useMemo(() => {
    return HIDDEN_ROUTES.includes(location.pathname);
  }, [location.pathname]);

  const totalItems = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  const totalPrice = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cart.items]
  );

  if (shouldHide || totalItems === 0) return null;

  return (
    <div className="fixed bottom-15 left-0 right-0 w-full z-50">
      <button
        onClick={() => navigate("/cart")}
        className="w-full flex justify-between items-center px-5 py-3 bg-[#080d47] text-white rounded-lg shadow-xl transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer"
      >
        <div className="text-base font-semibold tracking-wide">
          {totalItems} item{totalItems > 1 ? "s" : ""} | ₹{totalPrice}
        </div>
        <div className="text-sm font-medium underline underline-offset-2">
          View Cart
        </div>
      </button>
    </div>
  );
};

export default GlobalCartPopup;
