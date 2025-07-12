import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../utils/api";
import { useNavigation } from "@react-navigation/native";

const initialForm = {
  house_block_no: "",
  area_road: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pincode: "",
};

const AddressScreen = () => {
  const [userId, setUserId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const listRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) setUserId(JSON.parse(data).id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/address");
      setAddresses(res.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingAddressId) {
        await API.put(`/auth/address/${editingAddressId}`, form);
      } else {
        await API.post("/auth/address", form);
      }
      setShowForm(false);
      setForm(initialForm);
      setEditingAddressId(null);
      fetchAddresses();
    } catch (err) {
      console.error("Address save error:", err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await API.delete(`/auth/address/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const startEdit = (item) => {
    setForm(item);
    setShowForm(true);
    setEditingAddressId(item.id);
  };

  const handleConfirmOrder = async () => {
    const selected = addresses.find((a) => a.id === selectedAddressId);
    if (selected) {
      try {
        await AsyncStorage.setItem("selectedAddress", JSON.stringify(selected));
        navigation.goBack();
      } catch (err) {
        console.error("Failed to save address:", err);
      }
    }
  };

  const renderForm = () => (
    <View style={styles.formContainer}>
      {Object.keys(initialForm).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.replace(/_/g, " ")}
          value={form[key]}
          onChangeText={(text) => setForm({ ...form, [key]: text })}
        />
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>
          {editingAddressId ? "Update Address" : "Save Address"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      {loading && (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#FF5733" />
        </View>
      )}
      <FlatList
        ref={listRef}
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Your Addresses</Text>
            {!showForm && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setShowForm(true);
                  setForm(initialForm);
                  setEditingAddressId(null);
                }}
              >
                <Text style={styles.addButtonText}>+ Add New Address</Text>
              </TouchableOpacity>
            )}
            {showForm && renderForm()}
            <Text style={styles.savedTitle}>Saved Addresses:</Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.addressItem,
              selectedAddressId === item.id && styles.selectedAddress,
            ]}
            onPress={() => setSelectedAddressId(item.id)}
          >
            <Text>
              {item.house_block_no}, {item.area_road}
            </Text>
            <Text>
              {item.city}, {item.district}
            </Text>
            <Text>
              {item.state}, {item.country} - {item.pincode}
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteAddress(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          selectedAddressId && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmOrder}
            >
              <Text style={styles.confirmButtonText}>Confirm and Proceed</Text>
            </TouchableOpacity>
          )
        }
      />
    </KeyboardAvoidingView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#080d47de",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#080d47de",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
  },
  addressItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedAddress: {
    borderColor: "#080d47de",
    borderWidth: 2,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editText: {
    marginRight: 16,
    color: "#080d47de",
    fontWeight: "500",
  },
  deleteText: {
    color: "#dc3545",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#080d47de",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
    zIndex: 10,
  },
});
