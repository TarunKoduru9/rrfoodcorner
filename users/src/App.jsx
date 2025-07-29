import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/authentication/LoginScreen";
import SignupScreen from "./screens/authentication/SignupScreen";
import ForgotPasswordScreen from "./screens/authentication/ForgorPasswordScreen";
import ResetPasswordScreen from "./screens/authentication/ResetPasswordScreen";
import VerifyOTPScreen from "./screens/authentication/VerifyOTPScreen";
import OtpLoginScreen from "./screens/authentication/OtpLoginScreen";
import PrivateRoute from "./utils/PrivateRoute";

import HomeScreen from "./screens/pages/HomeScreen";
import ProfileScreen from "./screens/menu/ProfileScreen";
import OrderScreen from "./screens/menu/OrderScreen";
import CategoryScreen from "./screens/pages/CategoryScreen";
import CartScreen from "./screens/pages/CartScreen";
import CouponScreen from "./screens/pages/CouponScreen";
import AddressScreen from "./screens/authentication/AddressScreen";
import SuccessScreen from "./screens/pages/SuccessScreen";
import FeedbackScreen from "./screens/menu/FeedbackScreen";
import AllItemsScreen from "./screens/pages/AllItemsScreen";

function App() {
  return (
    <Router>
      <div className="relative pb-16">
        <Routes>
          <Route path="/all-items" element={<AllItemsScreen />} />
          <Route path="/" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />
          <Route path="/verify-otp" element={<VerifyOTPScreen />} />
          <Route path="/otp-login" element={<OtpLoginScreen />} />

          <Route path="/home" element={<HomeScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/orders" element={<OrderScreen />} />
          <Route path="/feedback" element={<FeedbackScreen />} />
          <Route path="/category/:categoryId" element={<CategoryScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/coupons" element={<CouponScreen />} />
          <Route path="/address" element={<AddressScreen />} />
          <Route path="/success" element={<SuccessScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
