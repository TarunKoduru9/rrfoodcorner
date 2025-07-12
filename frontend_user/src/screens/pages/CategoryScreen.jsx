import React, { useEffect, useState } from "react";
import { useCart } from "../../utils/CartContext";
import GlobalCartPopup from "../../utils/GlobalCartPopup";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import API from "../../utils/api";

const CategoryItemsScreen = () => {
  const { dispatch } = useCart();

  const route = useRoute();
  const { categoryId } = route.params;

  const [availableFoodTypes, setAvailableFoodTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [foodType, setFoodType] = useState(null); // 'Veg' or 'Non-Veg'
  const [sort, setSort] = useState(null); // 'asc' or 'desc'
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const res = await API.get(`/auth/category/${categoryId}/keywords`);
        setKeywords(res.data);
      } catch (err) {
        console.error("Error fetching keywords:", err);
      }
    };

    fetchKeywords();
  }, [categoryId]);

  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const res = await API.get(`/auth/category/${categoryId}/foodtypes`);
        setAvailableFoodTypes(res.data); // Example: ["VEG", "NON VEG"]
      } catch (err) {
        console.error("Error fetching food types:", err);
      }
    };

    fetchFoodTypes();
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
      } catch (err) {
        console.error("Error fetching items:", err);
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
    if (sort === null) {
      setSort("asc");
    } else if (sort === "asc") {
      setSort("desc");
    } else {
      setSort(null);
    }
  };

  const toggleKeyword = (keyword) => {
    setSelectedKeyword(selectedKeyword === keyword ? null : keyword);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* Filters */}
      <View style={styles.filterRow}>
        {availableFoodTypes.includes("VEG") && (
          <TouchableOpacity
            style={[styles.filterBtn, foodType === "VEG" && styles.activeVeg]}
            onPress={() => toggleFilter("VEG")}
          >
            <View style={styles.greenDot} />
            <Text>Veg</Text>
          </TouchableOpacity>
        )}

        {availableFoodTypes.includes("NON VEG") && (
          <TouchableOpacity
            style={[
              styles.filterBtn,
              foodType === "NON VEG" && styles.activeNonVeg,
            ]}
            onPress={() => toggleFilter("NON VEG")}
          >
            <View style={styles.redDot} />
            <Text>Non-Veg</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.sortBtn, sort && styles.activeSort]}
          onPress={toggleSort}
        >
          <Text>
            {sort === "asc"
              ? "Low → High"
              : sort === "desc"
              ? "High → Low"
              : "Sort Price"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Keyword Chips */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.keywordRow}
        >
          {keywords.map((key) => (
            <TouchableOpacity
              key={key.id}
              onPress={() => toggleKeyword(key.name)}
              style={[
                styles.keywordChip,
                selectedKeyword === key.name && styles.activeKeyword,
              ]}
            >
              <Text
                style={{
                  color: selectedKeyword === key.name ? "#fff" : "#000",
                }}
              >
                {key.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Items */}
      <View>
        <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 200 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#080d47de" />
          ) : items.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No items found
            </Text>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image
                  source={{ uri: `${API.defaults.baseURL}${item.image_url}` }}
                  style={styles.image}
                />

                {/* Food type icon on top-right */}
                <View style={styles.foodTypeBadge}>
                  <View
                    style={[
                      styles.foodTypeBox,
                      {
                        borderColor:
                          item.food_type === "VEG" ? "#2ecc71" : "#e74c3c",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.foodTypeDot,
                        {
                          backgroundColor:
                            item.food_type === "VEG" ? "#2ecc71" : "#e74c3c",
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Overlay content inside image */}
                <View style={styles.overlayContent}>
                  <View style={styles.overlayLeft}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <Text style={styles.sub}>{item.subcontent}</Text>
                    <Text style={styles.meta}>
                      {item.food_type} • {item.combo_type}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      dispatch({
                        type: "ADD_TO_CART",
                        payload: {
                          ...item,
                          category_id: item.category_id,
                        },
                      })
                    }
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      <GlobalCartPopup />
    </View>
  );
};

export default CategoryItemsScreen;

const styles = StyleSheet.create({

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop:15
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    gap: 5,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  activeVeg: {
    borderColor: "#2ecc71",
    backgroundColor: "#eaffea",
  },
  activeNonVeg: {
    borderColor: "#e74c3c",
    backgroundColor: "#ffeaea",
  },
  sortBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  activeSort: {
    backgroundColor: "#ddd",
    borderColor: "#333",
  },
  overlayContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  overlayLeft: {
    flex: 1,
    paddingRight: 10,
  },
  addButton: {
    backgroundColor: "#080d47de",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  keywordRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  keywordChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginRight: 8,
    color: "black",
  },
  activeKeyword: {
    backgroundColor: "#080d47de",
    borderColor: "#080d47de",
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 400,
    objectFit: "cover",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  sub: {
    color: "white",
    fontSize: 14,
  },
  meta: {
    color: "white",
    fontSize: 12,
    marginTop: 3,
  },
  foodTypeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  foodTypeBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  foodTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  foodIconBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#2ecc71",
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#e74c3c",
  },
});
