import React, { useEffect, useState } from "react";
import { useCart } from "../../utils/CartContext";
import GlobalCartPopup from "../../utils/GlobalCartPopup";

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import API from "../../utils/api";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = () => {
  const { dispatch } = useCart();

  const [userName, setUserName] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [whatsNew, setWhatsNew] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user?.name || "");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUserName("");
    setDrawerVisible(false);
    navigation.replace("Login");
  };

  useEffect(() => {
    fetchUser();
    fetchCategories();
    fetchWhatsNew();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>RR Food Corner</Text>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <View style={styles.userIcon}>
            <Text style={styles.userLetter}>
              {userName?.[0]?.toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Drawer Modal */}
      <Modal animationType="slide" transparent visible={drawerVisible}>
        <SafeAreaView style={styles.drawerSafe}>
          <View style={styles.drawer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDrawerVisible(false)}
            >
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>

            <Text style={styles.drawerTitle}>Welcome {userName}</Text>

            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={styles.drawerItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
              <Text style={styles.drawerItem}>Orders</Text>
            </TouchableOpacity>
            <Text style={styles.drawerItem}>Terms</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Feedback")}>
              <Text style={styles.drawerItem}>Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Main Content */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF5733" />
          <Text style={{ marginTop: 10, fontSize: 16, color: "#444" }}>
            Loading menu...
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Delivery/Takeaway Buttons */}
          <View style={styles.toggleRow}>
            <TouchableOpacity style={styles.toggleBtn}>
              <Text style={styles.toggleText}>Delivery{"\n"}30 Mins</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleBtn}>
              <Text style={styles.toggleText}>Takeaway{"\n"}Our Store</Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View>
            <Text style={styles.sectionTitle}>What are you craving for?</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCard}
                  onPress={() =>
                    navigation.navigate("CategoryItems", {
                      categoryId: cat.id,
                      categoryName: cat.name,
                    })
                  }
                >
                  <Image
                    source={{
                      uri: `${API.defaults.baseURL}${cat.catimage_url}`,
                    }}
                    style={styles.categoryImage}
                  />
                  <Text style={styles.categoryLabel}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* What's New */}
          <View>
            <Text style={styles.sectionTitle}>What&apos;s New</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.foodScroll}
              showsHorizontalScrollIndicator={false}
            >
              {whatsNew.map((item) => (
                <View key={item.id} style={styles.foodCard}>
                  <Image
                    source={{ uri: `${API.defaults.baseURL}${item.image_url}` }}
                    style={styles.foodImage}
                  />
                  <BlurView
                    intensity={40}
                    tint="light"
                    style={styles.foodOverlay}
                  >
                    <View style={styles.foodboard}>
                      <Text style={styles.foodName}>{item.name}</Text>
                      <Text style={styles.foodPrice}>₹{item.price}</Text>
                      <Text style={styles.foodDesc}>{item.subcontent}</Text>
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
                        style={styles.addBtn}
                      >
                        <Text style={styles.addBtnText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={{ height: 50 }} />
        </ScrollView>
      )}
      <GlobalCartPopup />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  userIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  userLetter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  drawerSafe: {
    flex: 1,
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: "#fff",
    padding: 20,
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  drawerItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  logoutItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#ff4d4d",
    fontWeight: "bold",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 16,
  },
  toggleBtn: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  toggleText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },

  // Categories (grid layout)
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  categoryCard: {
    width: (screenWidth - 80) / 3,
    alignItems: "center",
    marginBottom: 25,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },

  // What's New scroll section
  foodScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  foodCard: {
    width: 360,
    height: 360,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f8f8f8",
  },
  foodImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  foodOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  foodboard: {
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    padding: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  foodPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 2,
  },
  foodDesc: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginVertical: 4,
  },
  addBtn: {
    backgroundColor: "#080d47de",
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
    width: 50,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
