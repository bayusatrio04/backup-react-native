import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (isFirstLaunch === null) {
          await AsyncStorage.setItem('isFirstLaunch', 'false');
          navigation.replace('Onboarding');
        } else {
          const accessToken = await AsyncStorage.getItem('accessToken');
          if (accessToken) {
            setIsLoggedIn(true);
          } else {
            // navigation.replace('LoginScreen');
            navigation.replace('Onboarding');
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // navigation.replace('LoginScreen');
        navigation.replace('Onboarding');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.replace('Home');
    }
  }, [isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo_djipay_v2.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
