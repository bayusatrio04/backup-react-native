import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TotalSummary = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/total-absensi-per-karyawan/total-all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={[styles.card, styles.totalCard]}>
          <Text style={styles.cardTitle}>Total</Text>
          <Text style={styles.cardValue}>{data ? data['Total'] : '0'}</Text>
        </View>
        <View style={[styles.card, styles.checkinCard]}>
          <Text style={styles.cardTitle}>Check-in</Text>
          <Text style={styles.cardValue}>{data ? data['Check In'] : '0'}</Text>
        </View>
        <View style={[styles.card, styles.checkoutCard]}>
          <Text style={styles.cardTitle}>Checkout</Text>
          <Text style={styles.cardValue}>{data ? data['Check Out'] : '0'}</Text>
        </View>
        <View style={[styles.card, styles.lateCard]}>
          <Text style={styles.cardTitle}>Terlambat</Text>
          <Text style={styles.cardValue}>{data ? data['Late-Checkin'] : '0'}</Text>
        </View>
        <View style={[styles.card, styles.ontimeCard]}>
          <Text style={styles.cardTitle}>Tepat Waktu</Text>
          <Text style={styles.cardValue}>{data ? data['On-Time'] : '0'}</Text>
        </View>
        <View style={[styles.card, styles.izin]}>
          <Text style={styles.cardTitle}>Izin</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: '48%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  totalCard: {
    backgroundColor: '#f0f2f5',
    borderColor: '#a9d5a9',
    borderWidth: 1,
  },
  checkinCard: {
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
    borderWidth: 1,
  },
  checkoutCard: {
    backgroundColor: '#fff1f0',
    borderColor: '#ffa39e',
    borderWidth: 1,
  },
  lateCard: {
    backgroundColor: '#fff7e6',
    borderColor: '#ffe58f',
    borderWidth: 1,
  },
  ontimeCard: {
    backgroundColor: '#fff7e6',
    borderColor: '#b7eb8f',
    borderWidth: 1,
  },
  izin: {
    backgroundColor: '#edf7ed',
    borderColor: '#a9d5a9',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
});

export default TotalSummary;
