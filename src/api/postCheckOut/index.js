import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native'; // Import Platform
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
export const CheckOutButton = () => {
  const [isConnected, setIsConnected] = useState(true);
  if (!isConnected) {
    Alert.alert('No Internet Connection', 'Check your internet connection!');
    return;
  }
  const [loading, setLoading] = useState(false);
  const [hasCheckedOutToday, setHasCheckedOutToday] = useState(false); // Tambahkan state untuk menandai apakah pengguna sudah check-out hari ini
  const navigation = useNavigation();

  useEffect(() => {
    const checkCheckoutStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.post(
          'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/latest',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = response.data;
        if (data && moment(data.tanggal_absensi).isSame(moment(), 'day') && data.id_absensi_type === 2) { // Perbaiki pengecekan operator untuk id_absensi_type
          setHasCheckedOutToday(true);
        }
      } catch (error) {
        console.error('Error checking checkout status:', error);
      }
    };

    checkCheckoutStatus();
  }, []);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      let locationPermissionStatus;
      if (Platform.OS === 'ios') {
        locationPermissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        locationPermissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }

      if (locationPermissionStatus !== RESULTS.GRANTED) {
        let requestResult;
        if (Platform.OS === 'ios') {
          requestResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
          requestResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }
        if (requestResult !== RESULTS.GRANTED) {
          throw new Error('Izin akses lokasi tidak diberikan');
        }
      }

      if (hasCheckedOutToday) { // Tambahkan pengecekan apakah pengguna sudah checkout hari ini
        Alert.alert('Peringatan', 'Anda sudah melakukan CheckOut hari ini');
      } else {  
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('Loading');
        }, 5000);
        performCheckout();
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Gagal melakukan check Out:', error.message);
      Alert.alert('Gagal melakukan check Out');
    } finally {
      setLoading(false);
    }
  };

  const performCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken'); // Ambil token di sini jika diperlukan
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;

          const currentDate = moment().tz('Asia/Jakarta');
          const formattedDay = currentDate.format('dddd'); 
          const formattedDate = currentDate.format('YYYY-MM-DD');
          const formattedTime = currentDate.format('HH:mm:ss');

          const requestData = {
            id_absensi_type: 2,
            id_absensi_status: 2,
            day: formattedDay,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            tanggal_absensi: formattedDate,
            waktu_absensi: formattedTime,
     
          };

          const response = await axios.post(
            'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/create',
            requestData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
            }
          );

          if (response.data.success) {
            console.log('Check Out gagal');
            Alert.alert('Check Out gagal');
          } else {
            console.log('Check Out berhasil');
            Alert.alert('Check Out berhasil');
            navigation.replace('Home');
          }
        },
        error => {
          console.error('Gagal mendapatkan lokasi:', error.message);
          Alert.alert('Gagal mendapatkan lokasi');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } catch (error) {
      console.error('Gagal melakukan check Out:', error.message);
      Alert.alert('Gagal melakukan check Out');
    }
  };

  return (
    // <View>
    //   <TouchableOpacity
    //     onPress={handleCheckout}
    //     style={styles.button}
    //   >
    //     <Text styles={styles.buttonText}>Check Out</Text>
    //   </TouchableOpacity>
    // </View>
      <View style={styles.container}>
        {loading && (
          <View style={styles.overlay} />
        )}
        <TouchableOpacity onPress={handleCheckout} style={styles.button}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Check Out</Text>
          )}
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ef3535ff',
    borderRadius: 10,
    width: 90,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    color: "white",
    textAlign: 'center',
  },
});


