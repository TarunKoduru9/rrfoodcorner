const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Route imports
//User
const userAuthRoutes = require("./src/routes/user_routes/users_auth");
const userhomeRoutes = require("./src/routes/user_routes/users_home");
const categoryItemRouter = require("./src/routes/user_routes/users_categoryItem");
const settingsRoutes = require("./src/routes/user_routes/users_settingsRoutes");
const orderRoutes = require("./src/routes/user_routes/users_order");
const usercoupon = require("./src/routes/user_routes/users_coupon");
const address = require("./src/routes/user_routes/user_address");
const userfeedback = require("./src/routes/user_routes/user_feedback");

//Admin
const adminAuthRoutes = require("./src/routes/admin_routes/admin_auth");
const adminCategoryRoutes = require("./src/routes/admin_routes/admin_categories");
const adminFoodItemsRoutes = require("./src/routes/admin_routes/admin_foodItems");
const usersdata = require("./src/routes/admin_routes/admin_usersdata");
const adminOrdersRoute = require("./src/routes/admin_routes/admin_orders");
const adminCoupons = require("./src/routes/admin_routes/admin_coupons");
const admintaxes = require("./src/routes/admin_routes/admin_taxes");
const adminPermission = require("./src/routes/admin_routes/admin_permissions");
const controlRoutes = require("./src/routes/admin_routes/admin_control");
const deliveryRoutes = require("./src/routes/admin_routes/admin_delivery");
const dashitem = require("./src/routes/admin_routes/admin_dashitem");
const keywordRoutes = require("./src/routes/admin_routes/admin_keywords");
const adminfeedback = require("./src/routes/admin_routes/admin_feedback");

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));

// User routes
app.use("/auth", userAuthRoutes);
app.use("/auth/home", userhomeRoutes);
app.use("/auth/category", categoryItemRouter);
app.use("/auth/settings", settingsRoutes);
app.use("/auth/order", orderRoutes);
app.use("/auth/coupons", usercoupon);
app.use("/auth/address", address);
app.use("/auth/feedback", userfeedback);

// Admin routes
app.use("/admin/me", adminPermission);
app.use("/admin", adminAuthRoutes);
app.use("/admin/categories", adminCategoryRoutes);
app.use("/admin/food-items", adminFoodItemsRoutes);
app.use("/admin/usersdata", usersdata);
app.use("/admin/orders", adminOrdersRoute);
app.use("/admin/coupons", adminCoupons);
app.use("/admin/settings", admintaxes);
app.use("/admin/control", controlRoutes);
app.use("/admin/delivery", deliveryRoutes);
app.use("/admin/dashitem", dashitem);
app.use("/admin/keywords", keywordRoutes);
app.use("/admin/feedback", adminfeedback);

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
