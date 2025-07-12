import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../utils/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../utils/api";

const CartScreen = () => {
  const { cart, dispatch } = useCart();
  const cartItems = cart.items;
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [settings, setSettings] = useState({ delivery_charge: 0, taxes: 0 });
  const [exploreItems, setExploreItems] = useState([]);

  // Load userId once
  useEffect(() => {
    const getUserId = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUserId(JSON.parse(userData).id);
    };
    getUserId();
  }, []);

  // Load delivery charge and tax
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/auth/settings");
        setSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // Load address and coupon from AsyncStorage on focus
  useEffect(() => {
    const loadCouponAndAddress = async () => {
      try {
        const couponData = await AsyncStorage.getItem("selectedCoupon");
        const addressData = await AsyncStorage.getItem("selectedAddress");

        if (couponData) setCoupon(JSON.parse(couponData));
        if (addressData) setSelectedAddress(JSON.parse(addressData));
      } catch (err) {
        console.error("Failed to load address or coupon:", err);
      }
    };

    const unsubscribe = navigation.addListener("focus", loadCouponAndAddress);
    return unsubscribe;
  }, [navigation]);

  // Explore More logic
  useEffect(() => {
    const fetchExploreItems = async () => {
      if (!cartItems.length || !cartItems[0].category_id) return;
      try {
        const res = await API.get(
          `/auth/category/${cartItems[0].category_id}/items`
        );
        const filtered = res.data.filter(
          (item) => !cartItems.some((ci) => ci.id === item.id)
        );
        setExploreItems(filtered.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch explore items", err);
      }
    };
    fetchExploreItems();
  }, [cartItems]);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigation.replace("Home");
    }
  }, [cartItems, navigation]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const discount = coupon
    ? coupon.discount_type === "flat"
      ? Number(coupon.discount_value) || 0
      : Math.min(
          (subtotal * (Number(coupon.discount_value) || 0)) / 100,
          Number(coupon.max_discount) || 0
        )
    : 0;

  const deliveryCharge = Number(settings.delivery_charge) || 0;
  const taxAmount = Number(settings.taxes) || 0;
  const total = subtotal - discount + taxAmount + deliveryCharge;
  const safeTotal = Number(total) || 0;
  const isLoggedIn = !!userId;

  const handleSetAddress = () => navigation.navigate("Location");
  const handleCouponApply = () => navigation.navigate("Coupons");

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: `${API.defaults.baseURL}${item.image_url}` }}
        style={styles.cartImage}
      />
      <View style={styles.cartDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() =>
              dispatch({ type: "DECREMENT_QUANTITY", payload: item })
            }
          >
            <Text style={styles.qtyBtn}>-</Text>
          </TouchableOpacity>
          <Text>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() =>
              dispatch({ type: "INCREMENT_QUANTITY", payload: item })
            }
          >
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.foodTypeDot,
          {
            backgroundColor: item.food_type === "VEG" ? "#2ecc71" : "#e74c3c",
          },
        ]}
      />
    </View>
  );

  return cartItems.length === 0 ? (
    <View style={styles.emptyCartContainer}>
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <TouchableOpacity
        style={styles.exploreBtn}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.exploreBtnText}>Explore Items</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <FlatList
      data={cartItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCartItem}
      ListFooterComponent={
        <>
          {/* Explore More Items */}
          <View>
            <View style={styles.expsection}>
              <Text style={styles.sectionTitle}>Explore More Items</Text>
              <TouchableOpacity
                style={styles.exploreitemBtn}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.exploreBtnText}>Explore</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {exploreItems.map((item) => (
                <View key={item.id} style={styles.exploreCard}>
                  <Image
                    source={{ uri: `${API.defaults.baseURL}${item.image_url}` }}
                    style={styles.exploreImage}
                  />
                  <Text>{item.name}</Text>
                  <Text>₹{item.price}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      dispatch({ type: "ADD_TO_CART", payload: item })
                    }
                    style={styles.addBtn}
                  >
                    <Text style={{ color: "#fff" }}>Add</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Address Section */}
          <View style={styles.addressSection}>
            {!isLoggedIn ? (
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.addressBtn}>Login to set address</Text>
              </TouchableOpacity>
            ) : !selectedAddress ? (
              <TouchableOpacity onPress={handleSetAddress}>
                <Text style={styles.addressBtn}>Set Address</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addressBox}>
                <TouchableOpacity onPress={handleSetAddress}>
                  <Text style={styles.addressTitle}>Delivery Address:</Text>
                  <Text>
                    {selectedAddress.house_block_no},{" "}
                    {selectedAddress.area_road}
                  </Text>
                  <Text>
                    {selectedAddress.city}, {selectedAddress.state} -{" "}
                    {selectedAddress.pincode}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Coupon Section */}
          <View style={styles.couponSection}>
            {coupon ? (
              <TouchableOpacity
                style={styles.couponApplied}
                onPress={() => {
                  setCoupon(null);
                  AsyncStorage.removeItem("selectedCoupon");
                }}
              >
                <Text style={styles.couponText}>
                  {coupon.code} -{" "}
                  {coupon.discount_type === "flat"
                    ? `Flat ₹${coupon.discount_value}`
                    : `${coupon.discount_value}% off`}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleCouponApply}
                style={styles.couponBtn}
              >
                <Text style={styles.couponText}>Apply Coupon</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Bill Details */}
          <View style={styles.billSection}>
            <Text style={styles.sectionTitle}>Bill Details</Text>
            <Text>Subtotal: ₹{subtotal.toFixed(2)}</Text>
            <Text>Coupon Discount: -₹{discount.toFixed(2)}</Text>
            <Text>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</Text>
            <Text>Tax: ₹{taxAmount.toFixed(2)}</Text>
            <Text style={styles.totalAmount}>
              Total: ₹{safeTotal.toFixed(2)}
            </Text>
          </View>

          {/* Pay Button */}
          <View>
            <TouchableOpacity
              onPress={async () => {
                if (!isLoggedIn) {
                  navigation.navigate("Login");
                } else if (!selectedAddress) {
                  alert("Please select an address before proceeding.");
                } else {
                  try {
                    const payload = {
                      user_id: userId,
                      items: cartItems.map((item) => ({
                        item_code: item.item_code,
                        name: item.name,
                        price: item.price,
                        image_url: item.image_url,
                        quantity: item.quantity,
                      })),
                      subtotal,
                      discount,
                      delivery_charge: deliveryCharge,
                      taxes: taxAmount,
                      total: safeTotal,
                      address: selectedAddress,
                    };

                    await API.post("/auth/order", payload);

                    await AsyncStorage.removeItem("selectedCoupon");
                    await AsyncStorage.removeItem("selectedAddress");

                    dispatch({ type: "CLEAR_CART" });
                    navigation.replace("Success");
                  } catch (err) {
                    console.error("Order placement failed", err);
                    alert("Order failed. Please try again.");
                  }
                }
              }}
              style={styles.payButton}
            >
              <Text style={styles.payButtonText}>
                {isLoggedIn ? "Pay" : "Login to Pay"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      }
    />
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  cartDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  qtyBtn: {
    fontSize: 20,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    color: "#333",
  },

  foodTypeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    top: 10,
    right: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  expsection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 15,
  },
  exploreitemBtn: {
    backgroundColor: "#080d47de",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 8,
  },

  exploreCard: {
    width: 140,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  exploreImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
  },
  addBtn: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#080d47de",
    borderRadius: 6,
  },

  addressSection: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    padding: 20,
  },
  addressBtn: {
    color: "#080d47de",
    fontWeight: "600",
    fontSize: 16,
  },
  addressBox: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
  },
  addressTitle: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },

  couponBtn: {
    marginHorizontal: 15,
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: "#080d47de",
    alignItems: "center",
  },
  couponText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  couponSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  couponApplied: {
    backgroundColor: "#080d47de",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  billSection: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
    gap: 6,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#000",
  },

  payButton: {
    margin: 20,
    backgroundColor: "#080d47de",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
  exploreBtn: {
    backgroundColor: "#080d47de",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
