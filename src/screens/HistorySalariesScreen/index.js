import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong, faCalendarDays, faChevronDown } from '@fortawesome/free-solid-svg-icons';
export default function HistorySalaries() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [salaryData, setSalaryData] = useState([]);
  const [position, setPosition] = useState('');
  const [year, setYear] = useState('');
  const [messages, setMessages] = useState('');

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const openYearModal = () => {
    setYearModalVisible(true);
  };

  const closeYearModal = () => {
    setYearModalVisible(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year.toString());
    setYearModalVisible(false);
  };

  const fetchData = async (year) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
          throw new Error('No token found');
      }
      const response = await axios.post(
        'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/salary/salary-calculate-by-token/year',
        { selectedYear: year },
        {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });
      
 
        setSalaryData(response.data.data);
        setPosition(response.data.Position);
        setYear(response.data.Year);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch salary data.');
    }
  };
  const formattedEarnings = (earnings) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(earnings).replace(',00', '');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filter your transactions by year</Text>
      <TouchableOpacity onPress={openYearModal}>
        <Text style={styles.yearButton}>{selectedYear}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={yearModalVisible}
        onRequestClose={closeYearModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={years}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleYearSelect(item)}>
                  <Text style={styles.yearItem}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.toString()}
            />
          </View>
        </View>
      </Modal>
      
      {/* <View style={styles.positionYearContainer}>
        
        <Text style={styles.positionText}>Position: {position}</Text>
        <Text style={styles.yearText}>Year: {year}</Text>
      </View> */}
      {(typeof salaryData === 'undefined' || salaryData.length === 0) && !messages ? (
      <Text style={styles.messagesText}>Data penggajian belum tersedia. Silakan cek kembali nanti.</Text>
    ) : (
        <FlatList
          data={salaryData}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.monthText}>{item.Month}</Text>
                <Text style={styles.dateText}>{year}</Text>
                <Text style={styles.dateText}>{position}</Text>
              </View>
              <Text style={styles.salaryText}>{formattedEarnings(item.Earnings)}</Text>
              {/* <FontAwesomeIcon icon={faChevronDown} size={15} color="#898383" /> */}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  yearButton: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
  },
  yearItem: { 
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextContainer: {
    flexDirection: 'column',
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  salaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  messagesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 300,
  },
  
});
