import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../utils/CartContext";
import GlobalCartPopup from "../../utils/GlobalCartPopup";
import API from "../../utils/api";
import BottomNavbar from "../../screens/pages/BottomNavbar";


const HomeScreen = () => {
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [whatsNew, setWhatsNew] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) setUserName(user.name);
    fetchCategories();
    fetchWhatsNew();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/auth/home/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const fetchWhatsNew = async () => {
    try {
      const res = await API.get("/auth/home/whatsnew");
      setWhatsNew(res.data);
    } catch (err) {
      console.error("Error loading what's new items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName("");
    setDrawerVisible(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-800">RR Food Corner</h1>
        <button
          onClick={() => setDrawerVisible(true)}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-800 cursor-pointer"
        >
          {userName?.[0]?.toUpperCase() || "G"}
        </button>
      </header>

      {/* Drawer */}
      {drawerVisible && (
        <div className="fixed inset-0 bg-black/40 z-30 flex justify-end">
          <div className="w-72 bg-white h-full p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Welcome, {userName}</h2>
              <button className="cursor-pointer" onClick={() => setDrawerVisible(false)}>✕</button>
            </div>
            <ul className="space-y-3 text-sm">
              {userName ? (
                <>
                  <li>
                    <button
                      className="hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate("/orders")}
                    >
                      Orders
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate("/feedback")}
                    >
                      Feedback
                    </button>
                  </li>
                  <li className="text-gray-500">Terms</li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 font-semibold cursor-pointer"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => {
                      setDrawerVisible(false);
                      navigate("/");
                    }}
                    className="text-blue-600 font-semibold cursor-pointer"
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 mt-4">Loading menu...</p>
          </div>
        ) : (
          <div className="space-y-10 pb-32">
            {/* Delivery & Takeaway */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-black text-white rounded-xl py-4 text-center text-sm font-medium cursor-pointer">
                Delivery
                <br />
                <span className="text-xs font-normal">30 Mins</span>
              </button>
              <button className="bg-black text-white rounded-xl py-4 text-center text-sm font-medium cursor-pointer">
                Takeaway
                <br />
                <span className="text-xs font-normal">Our Store</span>
              </button>
            </div>

            {/* Categories */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                What are you craving for?
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <img
                      src={`${API.defaults.baseURL}${cat.catimage_url}`}
                      alt={cat.name}
                      className="w-20 h-20 object-cover rounded-full border shadow-sm"
                    />
                    <p className="text-sm mt-2 font-medium text-gray-700 text-center">
                      {cat.name}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* What's New */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                What's New
              </h2>
              <div className="overflow-x-auto flex gap-4 scroll-smooth pb-2">
                {whatsNew.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[260px] max-w-[260px] rounded-xl shadow-md overflow-hidden relative bg-white"
                  >
                    <img
                      src={`${API.defaults.baseURL}${item.image_url}`}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 text-base">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        ₹{item.price}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.subcontent}
                      </p>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "ADD_TO_CART",
                            payload: {
                              ...item,
                              category_id: item.category_id,
                            },
                          })
                        }
                        className="mt-3 bg-black text-white px-4 py-2 text-sm rounded-md font-medium hover:bg-gray-800 cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <GlobalCartPopup />
    <BottomNavbar />
    </div>
  );
};

export default HomeScreen;
