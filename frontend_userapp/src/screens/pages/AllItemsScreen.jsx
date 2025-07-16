import React, { useEffect, useState, useCallback } from "react";
import API from "../../utils/api";
import { useCart } from "../../utils/CartContext";
import GlobalCartPopup from "../../utils/GlobalCartPopup";


const AllItemsScreen = () => {
  const { dispatch } = useCart();
  const [items, setItems] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [availableFoodTypes, setAvailableFoodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [foodType, setFoodType] = useState(null);
  const [sort, setSort] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  // Reusable fetchItems with proper dependencies
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (foodType) params.food_type = foodType;
      if (sort) params.sort = sort;
      if (selectedKeyword) params.keyword = selectedKeyword;
      if (selectedCategoryId) params.category_id = selectedCategoryId;

      const res = await API.get(`/auth/category/menu/items`, { params });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load all items:", err);
    } finally {
      setLoading(false);
    }
  }, [foodType, sort, selectedKeyword, selectedCategoryId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [typeRes, keywordRes, categoryRes] = await Promise.all([
          API.get(`/auth/category/menu/foodtypes`),
          API.get(`/auth/category/menu/keywords`),
          API.get(`/auth/category/menu/categories`),
        ]);
        setAvailableFoodTypes(typeRes.data);
        setKeywords(keywordRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error("Failed to fetch filters", err);
      }
    };

    fetchFilters();
  }, []);

  const toggleFoodType = (type) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-100 pb-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-screen-xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 my-5">
          {availableFoodTypes.includes("VEG") && (
            <button
              onClick={() => toggleFoodType("VEG")}
              className={`px-4 py-2 rounded-full border text-sm font-medium cursor-pointer ${
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
              onClick={() => toggleFoodType("NON VEG")}
              className={`px-4 py-2 rounded-full border text-sm font-medium cursor-pointer ${
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
            className={`px-4 py-2 rounded-full border text-sm font-medium cursor-pointer ${
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

        {/* categories */}
        {categories.length > 0 && (
          <div className="flex overflow-x-auto gap-3 pb-4 mb-4 px-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategoryId(
                    selectedCategoryId === cat.id ? null : cat.id
                  )
                }
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm transition cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Keywords */}
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
              <div className="absolute top-4 left-4 bg-white p-1 rounded-full shadow-sm">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    item.food_type === "VEG"
                      ? "border-green-600 bg-green-500"
                      : "border-red-600 bg-red-500"
                  }`}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-5 py-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm font-bold">₹{item.price}</p>
                <p className="text-xs line-clamp-2">{item.subcontent}</p>
                <p className="text-[11px] uppercase text-gray-300">
                  {item.food_type} • {item.combo_type}
                </p>
                <button
                  onClick={() =>
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: {
                        ...item,
                        category_id: item.category_id,
                        quantity: 1,
                      },
                    })
                  }
                  className="mt-3 bg-white text-black px-4 py-2 text-sm rounded-md font-semibold hover:bg-gray-200 transition cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <GlobalCartPopup />
    </div>
  );
};

export default AllItemsScreen;
