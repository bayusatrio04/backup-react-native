// src/screens/LoadingScreen.js

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    // Lakukan proses apa pun yang diperlukan di sini
    // Misalnya, ambil data, lakukan pengecekan, dll.

    // Simulasi proses loading selama 3 detik
    setTimeout(() => {
      navigation.navigate('Home'); // Navigasikan kembali ke halaman Home setelah proses selesai
    }, 3000);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
