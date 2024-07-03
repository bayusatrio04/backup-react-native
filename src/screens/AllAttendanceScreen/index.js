import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import TotalSummary from './assets/TotalSummary';

const currentMonthIndex = new Date().getMonth();
const currentYear = new Date().getFullYear();
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const API_ENDPOINT =
  'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/search';

export default function AllHistoryAttendance({ navigation }) {
  const [isConnected, setIsConnected] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [item, setItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page = 1) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(API_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          // Add other query params as needed based on selectedMonth and selectedYear
        },
      });

      setFilteredData(prevData => page === 1 ? response.data.items : [...prevData, ...response.data.items]);
      setTotalData(response.data._meta.totalCount);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
    }
  }, [isConnected]);

  useEffect(() => {
    if (isSearching && selectedMonth && selectedYear) {
      fetchData(1);
      setIsSearching(false);
    }
  }, [isSearching, selectedMonth, selectedYear]);

  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleLoadMore = () => {
    if (filteredData.length < totalData) {
      fetchData(currentPage + 1);
    }
  };

  const monthButtons = months.map((month, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.monthButton,
        selectedMonth === month && styles.selectedMonthButton,
      ]}
      onPress={() => {
        setSelectedMonth(month);
        setModalVisible(false);
      }}
    >
      <Text
        style={[
          styles.monthButtonText,
          selectedMonth === month && { color: 'white' },
        ]}
      >
        Bulan : {month}
      </Text>
    </TouchableOpacity>
  ));

  const yearButtons = years.map((year, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.yearButton,
        selectedYear === year.toString() && styles.selectedYearButton,
      ]}
      onPress={() => {
        setSelectedYear(year.toString());
        setYearModalVisible(false);
      }}
    >
      <Text
        style={[
          styles.yearButtonText,
          selectedYear === year.toString() && { color: 'white' },
        ]}
      >
        Tahun : {year}
      </Text>
    </TouchableOpacity>
  ));

  return (
    <ScrollView style={styles.container}>
      <TotalSummary item={item} />
      <View style={styles.content}>
        <Text style={styles.sectionHeader}>Choose Periode</Text>
        <TouchableOpacity
          style={styles.openModalButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.openModalButtonText}>Bulan : {selectedMonth}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>{monthButtons}</ScrollView>
            </View>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.openModalButton}
          onPress={() => setYearModalVisible(true)}
        >
          <Text style={styles.openModalButtonText}>Tahun : {selectedYear}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={yearModalVisible}
          onRequestClose={() => {
            setYearModalVisible(!yearModalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>{yearButtons}</ScrollView>
            </View>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setYearModalVisible(!yearModalVisible)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isLoading}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        {isLoading && currentPage === 1 ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView style={styles.containerContent}>
            {filteredData.map((items, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.dateText}>{items.tanggal_absensi}</Text>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => navigation.navigate('AttendanceDetailScreen', { attendance: items })}
                  >
                    <Text style={styles.detailButtonText}>Detail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {isLoading && currentPage > 1 && <ActivityIndicator size="large" color="#0000ff" />}
            {!isLoading && filteredData.length < totalData && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={handleLoadMore}
              >
                <Text style={styles.loadMoreButtonText}>Load More</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  openModalButton: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginBottom: 10,
  },
  openModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: 400,
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196f3',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthButton: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  selectedMonthButton: {
    backgroundColor: '#2196f3',
  },
  monthButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  yearButton: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  selectedYearButton: {
    backgroundColor: '#2196f3',
  },
  yearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196f3',
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerContent: {
    flex: 1,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailButton: {
    backgroundColor: '#2196f3',
    padding: 5,
    borderRadius: 5,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 14,
  },
  loadMoreButton: {
    padding: 10,
    backgroundColor: '#2196f3',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadMoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
