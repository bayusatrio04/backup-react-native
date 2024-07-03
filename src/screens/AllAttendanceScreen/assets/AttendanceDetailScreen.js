import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AttendanceDetailScreen({ route }) {
  const { attendance } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance Details</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{attendance.tanggal_absensi}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Check-in:</Text>
        <Text style={styles.value}>{attendance.waktu_absensi}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, attendance.id_absensi_type == 1 ? styles.checkIn : styles.checkOut]}>
          {attendance.id_absensi_type == 1 ? 'CHECK-IN' : 'CHECK-OUT'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  checkIn: {
    color: '#4caf50',
  },
  checkOut: {
    color: '#f44336',
  },
});
