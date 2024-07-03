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
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const API_ENDPOINT =
  'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/search';

export default function AllHistoryAttendance() {
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
      fetchData();
      setIsSearching(false);
    }
  }, [isSearching, selectedMonth, selectedYear]);

  const handleSearch = () => {
    setIsSearching(true);
  };

  const filterDataByMonthAndYear = (data) => {
    if (!data.items) return [];

    const filteredItems = data.items.filter((item) => {
      const itemDate = new Date(item.tanggal_absensi);
      const itemMonth = itemDate.getMonth();
      const itemYear = itemDate.getFullYear();
      return (
        itemMonth === months.indexOf(selectedMonth) &&
        itemYear.toString() === selectedYear
      );
    });

    const groupedData = filteredItems.reduce((acc, item) => {
      const date = item.tanggal_absensi;
      if (!acc[date]) {
        acc[date] = { checkIn: null, checkOut: null };
      }
      if (item.id_absensi_type === 1) {
        acc[date].checkIn = item;
      } else if (item.id_absensi_type === 2) {
        acc[date].checkOut = item;
      }
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, { checkIn, checkOut }]) => ({
      date,
      checkIn,
      checkOut,
    }));
  };

  const handleFetchError = (error) => {
    console.error('Error fetching data:', error);
    Alert.alert('Error', 'Failed to fetch data. Please try again later.');
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!selectedMonth || !selectedYear) {
        return;
      }
      const token = await AsyncStorage.getItem('accessToken');
      const queryParams = `?month=${months.indexOf(selectedMonth) + 1}&year=${selectedYear}`;
      const response = await axios.get(API_ENDPOINT + queryParams, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      const filteredData = filterDataByMonthAndYear(data);
      setFilteredData(filteredData);
      setTotalData(filteredData.length);
    } catch (error) {
      handleFetchError(error);
    }
    setIsLoading(false);
  };

  const renderAttendanceData = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (!filteredData || filteredData.length === 0) {
      return <Text>Data tidak ditemukan.</Text>;
    } else {
      return filteredData.map((item, index) => (
        <View key={index} style={styles.attendanceItem}>
          <Text style={styles.dateText}>
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeTextContainer}>
              <View style={styles.timeIcon}>
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  size={20}
                  color="blue"
                />
              </View>
              <Text style={styles.timeText}>
                {item.checkIn ? item.checkIn.waktu_absensi : 'N/A'}
              </Text>
            </View>
            <View style={styles.timeTextContainer}>
              <View style={styles.timeIcon}>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  size={20}
                  color="blue"
                />
              </View>
              <Text style={styles.timeText}>
                {item.checkOut ? item.checkOut.waktu_absensi : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      ));
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

        <View style={styles.resultContainer}>{renderAttendanceData()}</View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  content: {
    flex:1

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
    color: '#fff',
    fontSize: 16,
  },
  monthButton: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedMonthButton: {
    backgroundColor: '#2196f3',
  },
  monthButtonText: {
    fontSize: 16,
  },
  yearButton: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedYearButton: {
    backgroundColor: '#2196f3',
  },
  yearButtonText: {
    fontSize: 16,
    alignSelf: 'center',
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#2196f3',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
  },

  tableContainer: {
    flex: 1,
    // marginTop: 140,
  },
  attendanceItem: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 15,
    shadowRadius: 7.84,
    elevation: 3,
    },
    dateText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    },
    timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    },
    timeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    },
    timeIcon: {
    marginRight: 10,
    backgroundColor: 'rgba(207, 218, 255, 0.3)',
    padding: 10,
    borderRadius: 5,
    },
    timeText: {
    fontSize: 16,
    },
});
