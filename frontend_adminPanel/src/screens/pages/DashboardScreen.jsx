import React, { useEffect, useState , useCallback} from "react";
import styles from "./Styles/DashboardScreen.module.css";
import API from "../../utils/api";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const DashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ from: "", to: "" });

const fetchStats = useCallback(async () => {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await API.get(`/admin/dashboard?${query}`);
    setStats(res.data);
  } catch (error) {
    console.error("Error loading dashboard stats", error);
  } finally {
    setLoading(false);
  }
}, [filters]);


  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleInput = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading || !stats) return <div className={styles.loading}>Loading...</div>;

  const statusData = {
    labels: Object.keys(stats.ordersByStatus || {}),
    datasets: [
      {
        label: "Orders by Status",
        data: Object.values(stats.ordersByStatus || {}),
        backgroundColor: "#4e73df",
      },
    ],
  };

  const mostSoldData = {
    labels: stats.mostSoldItems?.map((item) => item.name),
    datasets: [
      {
        data: stats.mostSoldItems?.map((item) => item.total_sold),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin Dashboard</h2>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleInput}
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleInput}
        />
      </div>

      {/* Stat Cards */}
      <div className={styles.cardsGrid}>
        <div className={styles.card}><p>Users</p><h3>{stats.totalUsers}</h3></div>
        <div className={styles.card}><p>Orders</p><h3>{stats.totalOrders}</h3></div>
        <div className={styles.card}><p>Revenue</p><h3>₹{stats.totalRevenue}</h3></div>
        <div className={styles.card}><p>Categories</p><h3>{stats.totalCategories}</h3></div>
        <div className={styles.card}><p>Food Items</p><h3>{stats.totalItems}</h3></div>
      </div>

      {/* Charts */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartBox}>
          <h4>Orders by Status</h4>
          <Bar data={statusData} />
        </div>

        <div className={styles.chartBox}>
          <h4>Most Sold Items</h4>
          <Pie data={mostSoldData} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className={styles.recentBox}>
        <h4>Recent Orders</h4>
        <table className={styles.recentTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_name}</td>
                <td>{order.status}</td>
                <td>₹{order.subtotal}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardScreen;
