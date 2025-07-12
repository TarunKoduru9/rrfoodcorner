import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../utils/api"; // Make sure this points to your baseURL

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userData = await AsyncStorage.getItem("user");
        if (!userData) return;

        const userId = JSON.parse(userData).id;

        const res = await API.get(`/auth/order/${userId}`);
        setOrders(res.data.orders); // assumes { orders: [...] }
      } catch (err) {
        console.error("Failed to fetch order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }) => {
    const orderDate = new Date(item.date).toLocaleString();
    const status = item.status || "Processing";
    const orderItems =
      typeof item.items === "string" ? JSON.parse(item.items) : item.items;

    return (
      <View style={styles.orderCard}>
        <Text style={styles.date}>Date: {orderDate}</Text>
        <Text>Status: {status}</Text>

        {orderItems.map((i, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Image
              source={{ uri: `${API.defaults.baseURL}${i.image_url}` }}
              style={styles.image}
            />
            <View>
              <Text style={styles.name}>{i.name}</Text>
              <Text>
                ₹{i.price} × {i.quantity}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={styles.loading}>
        <Text>No past orders found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default OrderScreen;


const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
});

