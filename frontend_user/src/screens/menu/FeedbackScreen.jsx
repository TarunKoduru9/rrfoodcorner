import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../utils/api';

const FeedbackForm = () => {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState('5');
  const [comments, setComments] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('User not logged in');
      return;
    }

    try {
      await API.post('/auth/feedback', {
        name: user.name,
        rating,
        comments,
      });
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      setRating('5');
      setComments('');
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      Alert.alert('Error', 'Failed to submit feedback.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Leave Feedback</Text>

      <Text style={styles.label}>Rating</Text>
      <Picker selectedValue={rating} onValueChange={setRating}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Picker.Item key={n} label={n.toString()} value={n.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Comments</Text>
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        value={comments}
        onChangeText={setComments}
        placeholder="Write your feedback here"
      />

      <Button title="Submit Feedback" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { marginTop: 10, fontWeight: '600' },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
});

export default FeedbackForm;
