import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useCart } from "../../utils/CartContext";
import API from "../../utils/api";

const FoodFeedbackForm = ({ user }) => {
  const { cart } = useCart(); 
  const [feedbacks, setFeedbacks] = useState(
    cart.items.map((item) => ({
      item_id: item.id,
      name: item.name,
      rating: "5",
      comments: "",
    }))
  );

  const handleFeedbackChange = (index, field, value) => {
    const newFeedbacks = [...feedbacks];
    newFeedbacks[index][field] = value;
    setFeedbacks(newFeedbacks);
  };

  const handleSubmit = async () => {
    try {
      await Promise.all(
        feedbacks.map((f) =>
          API.post("/auth/foodfeedback", {
            user_id: user.id,
            item_id: f.item_id,
            rating: f.rating,
            comments: f.comments,
          })
        )
      );
      Alert.alert("Thanks!", "Feedback submitted successfully.");
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert("Error", "Failed to submit feedback.");
    }
  };

  return (
    <FlatList
      data={feedbacks}
      keyExtractor={(item) => item.item_id.toString()}
      ListHeaderComponent={<Text style={styles.heading}>Rate Your Food</Text>}
      renderItem={({ item, index }) => (
        <View style={styles.card}>
          <Text style={styles.label}>{item.name}</Text>
          <Picker
            selectedValue={item.rating}
            onValueChange={(val) => handleFeedbackChange(index, "rating", val)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <Picker.Item key={n} label={`${n}`} value={`${n}`} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Comments"
            multiline
            value={item.comments}
            onChangeText={(val) => handleFeedbackChange(index, "comments", val)}
          />
        </View>
      )}
      ListFooterComponent={
        <Button title="Submit All Feedback" onPress={handleSubmit} />
      }
    />
  );
};

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "bold", margin: 10 },
  card: { padding: 15, borderBottomWidth: 1, borderColor: "#ccc" },
  label: { fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    textAlignVertical: "top",
  },
});

export default FoodFeedbackForm;
