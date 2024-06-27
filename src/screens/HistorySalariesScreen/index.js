import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faSearch  } from '@fortawesome/free-solid-svg-icons';

export default function HistorySalaries({ navigation }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [salaryData, setSalaryData] = useState([]);
  const [position, setPosition] = useState('');
  const [year, setYear] = useState('');
  const [messages, setMessages] = useState('');

  const goHome = () => {
    navigation.navigate('Home');
  };

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
        }
      );

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
  const handleYearChange = (text) => {
    if (/^\d*$/.test(text) && text.length <= 4) {
      setSelectedYear(text);
      if (text.length === 4) {
        fetchData(text);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.dasar}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={goHome} style={styles.iconContainer}>
            <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>History Salary</Text>
        </View>
        <Text style={styles.sectionText}>Your History Payroll Year</Text>

        <View style={styles.yearInputContainer}>
          <View style={styles.searchIcon}>

            <FontAwesomeIcon icon={faSearch} size={20} color="#333"  />
          </View>
          <TextInput
            style={styles.yearInput}
            value={selectedYear}
            onChangeText={handleYearChange}
            keyboardType="numeric"
            maxLength={4}
            placeholder="Enter year"
            placeholderTextColor="#333"
          />
        </View>
      </View>

      <View style={styles.contentWhite}>
        <View style={styles.containerContent}>
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
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={yearModalVisible}
          onRequestClose={closeYearModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeYearModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  dasar: {
    backgroundColor: '#E1AEFF',
    height: 270, // Adjust the height as needed
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    left: 30,
  },
  contentWhite: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    flex: 1,
    borderRadius: 30,
    padding: 30,
    marginTop: 0, // Adjust to position the white content area correctly over the red background
  },
  headerText: {
    fontSize: 24,
    fontWeight: '500',
    color: 'white',
  },
  sectionText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    alignSelf: 'center',
    letterSpacing: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  yearInputContainer: {
    flexDirection: 'row',
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'center',
    marginHorizontal:50,
    padding:20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    color: '#333',
    borderRadius: 8,
    marginBottom: 16,
  },
  yearInput: {

  },
  yearButton: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: 'bold',
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
