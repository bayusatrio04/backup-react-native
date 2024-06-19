import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment-timezone';

const fetchlatestAbsensiLog = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');

    if (!token) {
      throw new Error('Token tidak ditemukan di AsyncStorage');
    }

    const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/latest', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mendapatkan data absensi log');
    }

    const data = await response.json(); // Mengonversi respons menjadi format JSON
    // console.log(data); 
    return data;
  } catch (error) {
    console.error('Gagal mendapatkan data absensi log:', error.message);
    throw error;
  }
};

export default fetchlatestAbsensiLog;
