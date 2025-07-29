import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../utils/api";

const CouponScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentParams = location.state || {};
  const currentAppliedCode = currentParams?.selectedCoupon?.code;

  useEffect(() => {
    API.get("/auth/coupons")
      .then((res) => setCoupons(res.data))
      .catch((err) => console.error("Failed to fetch coupons", err))
      .finally(() => setLoading(false));
  }, []);

  const applyCoupon = (coupon) => {
    const isSameCoupon = currentAppliedCode === coupon.code;
    const selected = isSameCoupon ? null : coupon;

    try {
      if (selected) {
        localStorage.setItem("selectedCoupon", JSON.stringify(selected));
      } else {
        localStorage.removeItem("selectedCoupon");
      }
      navigate(-1); // Go back
    } catch (err) {
      console.error("Failed to save coupon:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white px-4 py-6">
      <h1 className="text-2xl font-bold text-center text-indigo-900 mb-6">
        🎁 Available Coupons
      </h1>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No active coupons available.</p>
      ) : (
        <div className="flex flex-col gap-5 pb-32">
          {coupons.map((coupon) => {
            const {
              id,
              code,
              description,
              discount_type,
              discount_value,
              max_discount,
              min_order_value,
              expires_at,
            } = coupon;

            const discountText =
              discount_type === "flat"
                ? `Flat ₹${discount_value}`
                : `${discount_value}% off`;

            return (
              <button
                key={id}
                onClick={() => applyCoupon(coupon)}
                className="text-left bg-white border border-indigo-200 hover:border-indigo-900 hover:bg-indigo-50 transition-all rounded-xl p-5 shadow-sm cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-lg font-bold text-indigo-900">{code}</h2>
                  {currentAppliedCode === code && (
                    <span className="text-sm text-green-600 font-medium">Applied</span>
                  )}
                </div>

                <p className="text-sm text-gray-800">{description}</p>
                <p className="text-sm text-gray-700 mt-2 font-medium">
                  {discountText}
                  {max_discount && ` (Max ₹${max_discount})`}
                </p>

                {min_order_value > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Min order value: ₹{min_order_value}
                  </p>
                )}

                {expires_at && (
                  <p className="text-xs italic text-red-500 mt-1">
                    Expires: {new Date(expires_at).toLocaleDateString()}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CouponScreen;
