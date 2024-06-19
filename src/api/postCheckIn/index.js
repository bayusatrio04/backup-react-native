import React,  {useState} from 'react';
import { View, Button, Alert, Platform, StyleSheet, TouchableOpacity, Text , ActivityIndicator} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment-timezone';
import { useNavigation } from '@react-navigation/native';

export const CheckInButton = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleCheckIn = async () => {
   
    try {
      setLoading(true);
      // Mendapatkan izin akses lokasi
      let locationPermissionStatus;
      if (Platform.OS === 'ios') {
        locationPermissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        locationPermissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }

      // Jika izin belum diberikan, minta izin akses lokasi dari pengguna
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

 
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Loading');
      }, 5000);
      await performCheckIn();

      navigation.replace('Home');
    } catch (error) {
      console.error('Gagal melakukan check in:', error.message);
      Alert.alert('Gagal melakukan check in');
    } finally {
      setLoading(false); // Menyembunyikan layar loading, terlepas dari hasil
    }
  };

  const performCheckIn = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Access Token:', token); 
  
      if (!token) {
        throw new Error('Token tidak ditemukan di AsyncStorage');
      }
  
      // Mendapatkan lokasi pengguna
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
  
          const currentDate = moment().tz('Asia/Jakarta');
          const formattedDay = currentDate.format('dddd'); // Format tanggal: YYYY-MM-DD
          const formattedDate = currentDate.format('YYYY-MM-DD'); // Format tanggal: YYYY-MM-DD
          const formattedTime = currentDate.format('HH:mm:ss');    // Format waktu: HH:MM:SS
          console.log(formattedDay);
          console.log(formattedDate);
          console.log(latitude);
          console.log(longitude);
  
          // Kirim data check-in ke server
          const requestData = {
            id_absensi_type: 1,
            id_absensi_status: 2,
            day: formattedDay,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            tanggal_absensi: formattedDate,
            waktu_absensi: formattedTime,
            bukti_hadir: 'Bukti.jpg'
          };
  
          try {
            console.log('Request Data:', requestData);
            const response = await axios.post(
              'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/create',
              requestData,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` // Menggunakan token Bearer
                },
              }
            );
  

            if (!response.data.success) {
              console.log('Check in berhasil');
              Alert.alert('Check in berhasil');
              navigation.replace('Home');
            } else {
              console.log('Check in gagal', response.data);
              Alert.alert('Check in gagal', response.data.message || 'Unknown error');
            }
          } catch (axiosError) {
            if (axiosError.response) {
              console.error('Response Data:', axiosError.response.data);
              console.error('Response Status:', axiosError.response.status);
              console.error('Response Headers:', axiosError.response.headers);
              Alert.alert('Gagal melakukan request check in', axiosError.response.data.message || 'Unknown server error');
            } else if (axiosError.request) {
              console.error('No Response:', axiosError.request);
              Alert.alert('Gagal melakukan request check in', 'No response from server');
            } else {
              console.error('Error Message:', axiosError.message);
              Alert.alert('Gagal melakukan request check in', axiosError.message);
            }
          }
        },
        error => {
          console.error('Gagal mendapatkan lokasi:', error.message);
          Alert.alert('Gagal mendapatkan lokasi', error.message);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } catch (error) {
      console.error('Gagal melakukan check in:', error.message);
      Alert.alert('Gagal melakukan check in', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay} />
      )}
      <TouchableOpacity onPress={handleCheckIn} style={styles.button}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Attend now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3bb82dff',
    borderRadius: 10,
    width: 85,
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

