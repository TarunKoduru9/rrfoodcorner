import React, { useEffect, useState } from "react";
import DashboardScreen from "./DashboardScreen";
import CategoriesScreen from "./CategoriesScreen";
import FoodItemsScreen from "./FoodItemsScreen";
import UsersScreen from "./UsersScreen";
import OrdersScreen from "./OrdersScreen";
import CouponScreen from "./CouponsScreen";
import ControlScreen from "./ControlScreen";
import DeliveryDashboard from "./DeliveryDashboard";
import DashItemsScreen from "./DashItemsScreen";
import FeedbackList from "./FeedbackList";
import { logoutUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const AdminPanelLayout = () => {
  const [userName, setUserName] = useState("");
  const [activeScreen, setActiveScreen] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setUserName(user.name || "");

    const screenPriority = [
      { key: "Dashboard", perm: "dashboard" },
      { key: "Control", perm: "control" },
      { key: "Users", perm: "usersdata" },
      { key: "Orders", perm: "orders" },
      { key: "Categories", perm: "categories" },
      { key: "FoodItems", perm: "food_items" },
      { key: "Coupons", perm: "coupons" },
      { key: "Delivery", perm: "delivery" },
      { key: "NewSection", perm: "newsection" },
      { key: "Feedback", perm: "feedback" },
    ];

    for (let screen of screenPriority) {
      if (user.permissions?.[screen.perm]?.can_view) {
        setActiveScreen(screen.key);
        break;
      }
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "Dashboard":
        return <DashboardScreen />;
      case "Control":
        return <ControlScreen />;
      case "Users":
        return <UsersScreen />;
      case "Orders":
        return <OrdersScreen />;
      case "Categories":
        return <CategoriesScreen />;
      case "FoodItems":
        return <FoodItemsScreen />;
      case "NewSection":
        return <DashItemsScreen />;
      case "Delivery":
        return <DeliveryDashboard />;
      case "Coupons":
        return <CouponScreen />;
      case "Feedback":
        return <FeedbackList />;
      default:
        return <p className="text-center">Page not found</p>;
    }
  };

  const Sidebar = () => (
    <aside className="w-64 bg-[#16203b] text-white flex flex-col p-4 space-y-2 shadow-xl h-full">
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button
          onClick={() => setIsSidebarVisible(false)}
          className="text-white text-2xl"
        >
          &times;
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 hidden lg:block">Admin Panel</h2>
      {userName && (
        <p className="mb-4 text-sm text-gray-300 hidden lg:block">
          Welcome, {userName}
        </p>
      )}

      <nav className="flex flex-col gap-5">
        {user?.permissions?.dashboard?.can_view && (
          <MenuButton
            title="Dashboard"
            active={activeScreen === "Dashboard"}
            onClick={() => setActiveScreen("Dashboard")}
          />
        )}
        {user?.permissions?.control?.can_view && (
          <MenuButton
            title="Control"
            active={activeScreen === "Control"}
            onClick={() => setActiveScreen("Control")}
          />
        )}
        {user?.permissions?.usersdata?.can_view && (
          <MenuButton
            title="Users"
            active={activeScreen === "Users"}
            onClick={() => setActiveScreen("Users")}
          />
        )}
        {user?.permissions?.orders?.can_view && (
          <MenuButton
            title="Orders"
            active={activeScreen === "Orders"}
            onClick={() => setActiveScreen("Orders")}
          />
        )}
        {user?.permissions?.categories?.can_view && (
          <MenuButton
            title="Manage Categories"
            active={activeScreen === "Categories"}
            onClick={() => setActiveScreen("Categories")}
          />
        )}
        {user?.permissions?.food_items?.can_view && (
          <MenuButton
            title="Food Items"
            active={activeScreen === "FoodItems"}
            onClick={() => setActiveScreen("FoodItems")}
          />
        )}
        {user?.permissions?.newsection?.can_view && (
          <MenuButton
            title="NewSection & Keywords"
            active={activeScreen === "NewSection"}
            onClick={() => setActiveScreen("NewSection")}
          />
        )}
        {user?.permissions?.coupons?.can_view && (
          <MenuButton
            title="Coupons"
            active={activeScreen === "Coupons"}
            onClick={() => setActiveScreen("Coupons")}
          />
        )}
        {user?.permissions?.delivery?.can_view && (
          <MenuButton
            title="Delivery"
            active={activeScreen === "Delivery"}
            onClick={() => setActiveScreen("Delivery")}
          />
        )}
        {user?.permissions?.feedback?.can_view && (
          <MenuButton
            title="Feedback"
            active={activeScreen === "Feedback"}
            onClick={() => setActiveScreen("Feedback")}
          />
        )}
        <MenuButton title="Logout" onClick={handleLogout} />
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">{Sidebar()}</div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarVisible && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute top-0 left-0 h-full w-64 z-50 bg-[#16203b] overflow-y-auto">
            {Sidebar()}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 w-full">
        {/* Hamburger for mobile */}
        <button
          className="lg:hidden mb-4 text-xl bg-gray-200 px-4 py-2 rounded"
          onClick={() => setIsSidebarVisible(true)}
        >
          ☰
        </button>

        {renderScreen()}
      </div>
    </div>
  );
};

const MenuButton = ({ title, onClick, active }) => (
  <button
    onClick={onClick}
    className={`text-left px-4 py-2 rounded transition cursor-pointer font-medium ${
      active
        ? "bg-white text-[#16203b] shadow font-semibold"
        : "hover:bg-white/10"
    }`}
  >
    {title}
  </button>
);

export default AdminPanelLayout;
