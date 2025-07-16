import React, { useEffect, useState, useCallback } from "react";
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

  if (loading || !stats)
    return <div className="text-center py-20 text-lg font-medium">Loading...</div>;

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
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
        ],
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-screen-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleInput}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleInput}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Users", value: stats.totalUsers },
          { label: "Orders", value: stats.totalOrders },
          { label: "Revenue", value: `₹${stats.totalRevenue}` },
          { label: "Categories", value: stats.totalCategories },
          { label: "Food Items", value: stats.totalItems },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white shadow rounded p-4 text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow p-4 rounded">
          <h4 className="font-semibold mb-3 text-gray-700">Orders by Status</h4>
          <Bar data={statusData} />
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h4 className="font-semibold mb-3 text-gray-700">Most Sold Items</h4>
          <Pie data={mostSoldData} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow p-4 rounded">
        <h4 className="text-lg font-semibold mb-4 text-gray-700">Recent Orders</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Subtotal</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.user_name || "Guest"}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">₹{order.subtotal}</td>
                  <td className="px-4 py-2">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
