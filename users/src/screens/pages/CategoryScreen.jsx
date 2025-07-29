import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../utils/CartContext";
import GlobalCartPopup from "../../utils/GlobalCartPopup";
import BottomNavbar from "../../screens/pages/BottomNavbar";
import API from "../../utils/api";

const CategoryItemsScreen = () => {
  const { dispatch } = useCart();
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");

  const [availableFoodTypes, setAvailableFoodTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [foodType, setFoodType] = useState(null);
  const [sort, setSort] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  useEffect(() => {
    API.get(`/auth/category/${categoryId}/keywords`)
      .then((res) => setKeywords(res.data))
      .catch(console.error);
  }, [categoryId]);

  useEffect(() => {
    API.get(`/auth/category/${categoryId}/foodtypes`)
      .then((res) => setAvailableFoodTypes(res.data))
      .catch(console.error);
  }, [categoryId]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const params = {};
        if (foodType) params.food_type = foodType;
        if (sort) params.sort = sort;
        if (selectedKeyword) params.keyword = selectedKeyword;

        const res = await API.get(`/auth/category/${categoryId}/items`, {
          params,
        });

        setItems(res.data);
        if (res.data.length > 0) {
          setCategoryName(res.data[0].category_name || "Category");
        } else {
          setCategoryName("Category");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId, foodType, sort, selectedKeyword]);

  const toggleFilter = (type) => {
    setFoodType(foodType === type ? null : type);
  };

  const toggleSort = () => {
    if (sort === null) setSort("asc");
    else if (sort === "asc") setSort("desc");
    else setSort(null);
  };

  const toggleKeyword = (keyword) => {
    setSelectedKeyword(selectedKeyword === keyword ? null : keyword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-100 pb-32">
      
      {/* Header */}
      <header className="flex justify-between items-center px-2 py-4 bg-white shadow-md sticky top-0 left-0 z-20">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition cursor-pointer"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate">
          {categoryName}
        </h1>{" "}
      </header> 

      <div className="max-w-screen-xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 my-5">
          {availableFoodTypes.includes("VEG") && (
            <button
              onClick={() => toggleFilter("VEG")}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition cursor-pointer ${
                foodType === "VEG"
                  ? "bg-green-100 border-green-600 text-green-800"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              🟢 Veg
            </button>
          )}
          {availableFoodTypes.includes("NON VEG") && (
            <button
              onClick={() => toggleFilter("NON VEG")}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition cursor-pointer ${
                foodType === "NON VEG"
                  ? "bg-red-100 border-red-600 text-red-800"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              🔴 Non-Veg
            </button>
          )}
          <button
            onClick={toggleSort}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition cursor-pointer ${
              sort
                ? "bg-gray-300 border-gray-600 text-gray-800"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            {sort === "asc"
              ? "₹ Low → High"
              : sort === "desc"
              ? "₹ High → Low"
              : "Sort Price"}
          </button>
        </div>

        {/* Keyword Chips */}
        {keywords.length > 0 && (
          <div className="flex overflow-x-auto gap-3 pb-4 mb-6 px-2">
            {keywords.map((key) => (
              <button
                key={key.id}
                onClick={() => toggleKeyword(key.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm transition cursor-pointer ${
                  selectedKeyword === key.name
                    ? "bg-indigo-900 text-white border-indigo-900"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                {key.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Items */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-600 mt-12">No items found</p>
      ) : (
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden shadow-md bg-white"
            >
              <img
                src={`${API.defaults.baseURL}${item.image_url}`}
                alt={item.name}
                className="w-full h-72 object-cover"
              />

              {/* Food Type Indicator */}
              <div className="absolute top-4 left-4 bg-white p-1 rounded-full shadow-sm">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    item.food_type === "VEG"
                      ? "border-green-600 bg-green-500"
                      : "border-red-600 bg-red-500"
                  }`}
                />
              </div>

              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-5 py-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm font-bold">₹{item.price}</p>
                  <p className="text-xs line-clamp-2">{item.subcontent}</p>
                  <p className="text-[11px] uppercase tracking-wide text-gray-300">
                    {item.food_type} • {item.combo_type}
                  </p>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "ADD_TO_CART",
                        payload: { ...item, category_id: item.category_id },
                      })
                    }
                    className="mt-3 bg-white text-black px-4 py-2 text-sm rounded-md font-semibold hover:bg-gray-200 transition cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <GlobalCartPopup />
      <BottomNavbar />
    </div>
  );
};

export default CategoryItemsScreen;
