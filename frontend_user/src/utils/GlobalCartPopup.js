import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useCart } from "../utils/CartContext";

  const HIDDEN_ROUTES = ["CartScreen", "Coupons"];

const GlobalCartPopup = () => {
  const { cart } = useCart();
  const navigation = useNavigation();

  const routeName = useNavigationState((state) => state?.routes[state.index]?.name);

  const shouldHide = useMemo(() => {
    return !routeName || HIDDEN_ROUTES.includes(routeName);
  }, [routeName]);

  const totalItems = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  const totalPrice = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cart.items]
  );

  if (shouldHide || totalItems === 0) return null;

  return (
    <View style={styles.popup}>
      <TouchableOpacity
        onPress={() => navigation.navigate("CartScreen")}
        style={styles.popupContent}
      >
        <Text style={styles.text}>
          {totalItems} item{totalItems > 1 ? "s" : ""} | ₹{totalPrice}
        </Text>
        <Text style={styles.action}>View Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GlobalCartPopup;

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: "#080d47de",
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
  },
  popupContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  action: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
