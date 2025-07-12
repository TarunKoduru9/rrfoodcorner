import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import API from "../../utils/api";

const CouponScreen = () => {
  const navigation = useNavigation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await API.get("/auth/coupons");
        setCoupons(res.data);
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const applyCoupon = async (coupon) => {
    const currentParams = navigation
      .getState()
      ?.routes?.find((r) => r.name === "CartScreen")?.params;

    const currentAppliedCode = currentParams?.selectedCoupon?.code;
    const isSameCoupon = currentAppliedCode === coupon.code;

    const selected = isSameCoupon ? null : coupon;

    try {
      if (selected) {
        await AsyncStorage.setItem("selectedCoupon", JSON.stringify(selected));
      } else {
        await AsyncStorage.removeItem("selectedCoupon");
      }

      navigation.goBack();
    } catch (err) {
      console.error("Failed to save coupon:", err);
    }
  };

  const renderCoupon = ({ item }) => (
    <TouchableOpacity
      style={styles.couponCard}
      onPress={() => applyCoupon(item)}
    >
      <Text style={styles.code}>{item.code}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.details}>
        {item.discount_type === "flat"
          ? `Flat ₹${item.discount_value}`
          : `${item.discount_value}% off`}
        {item.max_discount && ` (Max ₹${item.max_discount})`}
      </Text>
      {item.min_order_value > 0 && (
        <Text style={styles.minOrder}>
          Min order value ₹{item.min_order_value}
        </Text>
      )}
      {item.expires_at && (
        <Text style={styles.expiry}>
          Expires: {new Date(item.expires_at).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Coupons</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#080d47de" />
      ) : coupons.length === 0 ? (
        <Text style={styles.noCoupon}>No active coupons available.</Text>
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCoupon}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default CouponScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  list: {
    paddingBottom: 20,
  },
  couponCard: {
    borderWidth: 1,
    borderColor: "#080d47de",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff3ed",
  },
  code: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#080d47de",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#333",
  },
  details: {
    marginTop: 8,
    color: "#555",
    fontSize: 13,
  },
  minOrder: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  expiry: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
  noCoupon: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
