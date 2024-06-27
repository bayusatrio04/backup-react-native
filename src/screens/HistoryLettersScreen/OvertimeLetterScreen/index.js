import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function HistoryOvertimeLetter({ navigation }) {
  const [sections, setSections] = useState([]);

  const goHome = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    fetchOvertimeData();
  }, []);

  const fetchOvertimeData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(
        'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/auth-index',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data.data;
      const pendingData = data.filter(item => item.status === 'Pending');
      const approvedData = data.filter(item => item.status === 'Approved');
      const rejectedData = data.filter(item => item.status === 'Rejected');

      setSections([
        { title: 'Pending', data: pendingData },
        { title: 'Approved', data: approvedData },
        { title: 'Rejected', data: rejectedData },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch overtime data.');
    }
  };
  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
        amount = parseFloat(amount); // Parse string to number
    }
    if (isNaN(amount)) {
        return 'Rp. 0';
    }
    return ` ${amount.toLocaleString('id-ID', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'IDR',
    })}`;
};
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.overtimeDateText}>{item.overtime_date}</Text>
        
        <Text style={styles.overtimeHoursText}>{item.total_hours} hours</Text>
       
        <Text style={[styles.overtimeReasonText, {width:200}]}>{item.overtime_reason}</Text>
        <Text style={[
          styles.overtimeStatusText,
          item.status === 'Pending' && { color: 'red' },
          item.status === 'Approved' && { color: 'green' },
          item.status === 'Rejected' && { color: 'yellow' },
        ]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.itemTextContainer}>
<Text style={styles.overtimeCompensationText}>{item.total_compensation ? `${formatCurrency(item.total_compensation)}` : 'N/A'}</Text>
      </View>
      
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionText}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goHome} style={styles.iconContainer}>
          <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>History Overtime Letters</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
    backgroundColor: '#4B7BEC',
  },
  iconContainer: {
    position: 'absolute',
    left: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '500',
    color: 'white',
  },
  contentContainer: {
    padding: 20,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B7BEC',
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  itemTextContainer: {
    flexDirection: 'column',
  },
  overtimeDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  overtimeReasonText: {
    fontSize: 14,
    color: '#666',
  },
  overtimeHoursText: {
    fontSize: 14,
    color: '#666',
  },
  overtimeStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B7BEC',
  },
  overtimeCompensationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
