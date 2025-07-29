import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/authentication/LoginScreen";
import ForgotPasswordScreen from "./screens/authentication/ForgorPasswordScreen";
import ResetPasswordScreen from "./screens/authentication/ResetPasswordScreen";
import VerifyOTPScreen from "./screens/authentication/VerifyOTPScreen";
import Dashboard from "./screens/pages/DashboardScreen";
import CategoriesScreen from "./screens/pages/CategoriesScreen";
import AdminPanelLayout from "./screens/pages/AdminPanelLayout";
import FoodItemScreen from "./screens/pages/FoodItemsScreen";
import PrivateRoute from "./utils/PrivateRoute";
import UsersScreen from "./screens/pages/UsersScreen";
import OrdersScreen from "./screens/pages/OrdersScreen";
import CouponScreen from "./screens/pages/CouponsScreen";
import ControlScreen from "./screens/pages/ControlScreen";
import DashItemsScreen from "./screens/pages/DashItemsScreen";
import FeedbackList from "./screens/pages/FeedbackList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route path="/verify-otp" element={<VerifyOTPScreen />} />
        <Route element={<PrivateRoute />}>
          <Route path="/panel" element={<AdminPanelLayout />} />
          <Route path="/usersdata" element={<UsersScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<CategoriesScreen />} />
          <Route path="/food-items" element={<FoodItemScreen />} />
          <Route path="/orders" element={<OrdersScreen />} />
          <Route path="/coupons" element={<CouponScreen />} />
          <Route path="/control" element={<ControlScreen />} />
          <Route path="/dashitems" element={<DashItemsScreen />} />
          <Route path="/feedback" element={<FeedbackList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
