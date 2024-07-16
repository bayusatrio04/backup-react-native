import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faChevronLeft, faDollar, faMoneyCheckDollar, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function HistorySalaries({ navigation }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [salaryData, setSalaryData] = useState([]);
  const [position, setPosition] = useState('');
  const [year, setYear] = useState('');
  const [messages, setMessages] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const goHome = () => {
    navigation.navigate('Home');
  };
  const openDetailModal = (item) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
  };


  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);



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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goHome} style={styles.iconContainer}>
          <FontAwesomeIcon icon={faChevronLeft} size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>History Salary</Text>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={faSearch} size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.yearInput}
          value={selectedYear}
          onChangeText={handleYearChange}
          keyboardType="numeric"
          maxLength={4}
          placeholder="Enter by year"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.contentContainer}>
        {(typeof salaryData === 'undefined' || salaryData.length === 0) && !messages ? (
          <>
             <FontAwesomeIcon icon={faMoneyCheckDollar} size={100} color="#ccc" style={{alignSelf:'center', marginTop:20, position:'absolute'}} />
          <Text style={styles.messagesText}>Data penggajian belum tersedia. Silakan cek kembali nanti.</Text>
          </>
        ) : (
          <FlatList
            data={salaryData}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openDetailModal(item)}>
                <View style={styles.itemContainer}>
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.monthText}>{item.Month}</Text>
                    <Text style={styles.dateText}>{year}</Text>
                    <Text style={styles.dateText}>{position}</Text>
                  </View>
                  <Text style={styles.salaryText}>{formattedEarnings(item.Earnings)}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      <Modal
      animationType="slide"
      transparent={true}
      visible={detailModalVisible}
      onRequestClose={closeDetailModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          <Text style={styles.receiptHeader}>Salary Details | {selectedItem?.Month}</Text>
          <View style={styles.receiptContainer}>
            <Text style={styles.receiptText}>Status Nikah: {selectedItem?.["Status Nikah"]}</Text>
            <Text style={styles.receiptText}>Jumlah Anak: {selectedItem?.["Jumlah Tanggungan"]}</Text>
            <Text style={styles.receiptText}>Total Hadir: {selectedItem?.["Total Hadir"]}</Text>
            <Text style={styles.receiptText}>Total Tunjangan Makan: {formattedEarnings(selectedItem?.["Total Tunjangan Makan"])}</Text>
            {/* <Text style={styles.receiptText}>Total PPh 21: {formattedEarnings(selectedItem?.["Total PPh 21"])}</Text> */}
            <Text style={styles.receiptText}>Earnings: {formattedEarnings(selectedItem?.Earnings)}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeDetailModal}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#900" />
            <Text style={{right:7}}>Close</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#d32f2f',
  },
  iconContainer: {
    position: 'absolute',
    left: 20,
    top:70
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop:20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  yearInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  itemTextContainer: {
    flexDirection: 'column',
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  salaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  messagesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 'auto', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    // position: 'absolute',
    // top: 10,
    // right: 10,
    padding: 10,
  },
  receiptHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#900',
  },
  receiptContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    borderRadius: 10,
  },
  receiptText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
});
