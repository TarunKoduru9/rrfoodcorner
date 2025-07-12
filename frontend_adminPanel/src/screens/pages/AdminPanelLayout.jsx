import React, { useEffect, useState } from "react";
import DashboardScreen from "./DashboardScreen";
import CategoriesScreen from "./CategoriesScreen";
import FoodItemsScreen from "./FoodItemsScreen";
import UsersScreen from "./UsersScreen";
import OrdersScreen from "./OrdersScreen";
import CouponScreen from "./CouponsScreen";
import ControlScreen from "./ControlScreen";
import { logoutUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import styles from "./Styles/AdminPanelLayout.module.css";
import { useAuth } from "../../utils/AuthContext";
import DeliveryDashboard from "./DeliveryDashboard";
import DashItemsScreen from "./DashItemsScreen";
import FeedbackList from "./FeedbackList";

const AdminPanelLayout = () => {
  const [userName, setUserName] = useState("");
  const [activeScreen, setActiveScreen] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

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
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

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
        return <p>Page not found</p>;
    }
  };

  return (
    <div className={styles.container}>
      {isSidebarVisible && (
        <aside className={styles.sidebar}>
          <h2 className={styles.heading}>Admin Panel</h2>
          {userName && (
            <p className={styles.welcomeText}>Welcome, {userName}</p>
          )}
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
        </aside>
      )}

      <div className={styles.content}>
        <button
          className={styles.toggleBtn}
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          {isSidebarVisible ? "✕" : "☰"}
        </button>
        {renderScreen()}
      </div>
    </div>
  );
};

const MenuButton = ({ title, onClick, active }) => {
  return (
    <button
      className={`${styles.menuItem} ${active ? styles.activeItem : ""}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default AdminPanelLayout;
