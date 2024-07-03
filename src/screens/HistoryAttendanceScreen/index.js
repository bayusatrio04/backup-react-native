import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions,
  Modal, Pressable, SafeAreaView, Alert, Linking
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchlatestAbsensiLog } from '../../api/getLatestAttendance/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import ChartMarker from './ChartMarker';
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function HistoryAttendance() {
  const [isConnected, setIsConnected] = useState(true);
  const [activeButton, setActiveButton] = useState('checkIn');
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const currentMonthIndex = new Date().getMonth();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
  const screenWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latestData, setDataCheckIn] = useState([]);
  const [latestDataOut, setDataCheckOut] = useState([]);
  
  const navigation = useNavigation();

  const viewOnMap = () => {
    if (latestData && latestData.latitude && latestData.longitude) {
      const url = `https://www.google.co.id/maps/@${latestData.latitude},${latestData.longitude},20z?entry=ttu`;
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Coordinates not available.');
    }
  };
  const viewOnMapCheckOut = () => {
    if (latestDataOut && latestDataOut.latitude && latestDataOut.longitude) {
      const url = `https://www.google.co.id/maps/@${latestDataOut.latitude},${latestDataOut.longitude},20z?entry=ttu`;
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Coordinates not available.');
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Alert.alert('No Internet Connection', 'Check your internet connection!');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);


  const fetchLastestCheckin = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        throw new Error('Token tidak ditemukan di AsyncStorage');
      }

      const response =  await axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/check-in-today', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        throw new Error('Gagal mendapatkan data absensi log');
      }
  
      const latestData = response.data;
      console.log('Berhasil mendapatkan data checkout terbaru:', latestData);
  
      if (Array.isArray(latestData) && latestData.length > 0) {
        setDataCheckIn(latestData[0]);
      } else {
        setDataCheckIn({ messages: latestData.messages || 'Tidak ada data checkout terbaru' });
      }
  
    } catch (error) {
      console.error('Gagal mendapatkan data absensi log:', error.message);
      setDataCheckIn({ messages: error.message });
    }
  };
  const fetchLastestCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
  
      if (!token) {
        throw new Error('Token tidak ditemukan di AsyncStorage');
      }
  
      const response = await axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/check-out-today', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Gagal mendapatkan data absensi log');
      }
  
      const latestData = response.data;
      console.log('Berhasil mendapatkan data Checkin terbaru:', latestData);
  
      if (Array.isArray(latestData) && latestData.length > 0) {
        setDataCheckOut(latestData[0]);
      } else {
        setDataCheckOut({ messages: latestData.messages || 'Tidak ada data Checkin terbaru' });
      }
  
    } catch (error) {
      console.error('Gagal mendapatkan data absensi log:', error.message);
      setDataCheckOut({ messages: error.message });
    }
  };

  useEffect(() => {
    fetchLastestCheckin();
    fetchLastestCheckout();
  }, []);
  // const [type, setType] = useState(0);
  // useEffect(() => {

  //   setType(latestData.id_absensi_type);
  // }, []);
 

  const fetchData = async () => {
    setLoading(true);
    const monthIndex = months.indexOf(selectedMonth) + 1;
    const token = await AsyncStorage.getItem('accessToken');
    const url = `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/total-absensi-per-karyawan/total-check-in-month-year?year=${selectedYear}&month=${monthIndex.toString().padStart(2, '0')}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      setItem(json); // Mengatur data total check-in

      // Menentukan data yang dipilih untuk highlight
      const selected = json.find(entry => entry.Month === selectedMonth && entry.Year === parseInt(selectedYear));
      setSelectedData(selected); // Mengatur data yang dipilih ke state

      console.log('Berhasil get data Monthly check in');
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data from the API.');
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: [
          item.length > 0 ? item.find(entry => entry.Month === "January")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "February")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "March")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "April")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "May")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "June")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "July")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "August")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "September")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "October")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "November")?.Total : 0,
          item.length > 0 ? item.find(entry => entry.Month === "December")?.Total : 0,
        ],
        color: (opacity = 1) => `rgba(255, 180, 66, ${opacity})`,
        strokeWidth: 1
      }
    ]
  };
  
  

  const monthButtons = data.labels.map((month, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.monthButton, selectedMonth === month && styles.selectedMonthButton]}
      onPress={() => {
        setSelectedMonth(month);
        setSelectedMonthIndex(index);
        setModalVisible(!modalVisible);
      }}
    >
      <Text style={[styles.monthButtonText, selectedMonth === month && { backgroundColor: 'red', color: 'white' }]}>{month}</Text>
    </TouchableOpacity>
  ));

  const yearButtons = years.map((year, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.yearButton, selectedYear === year.toString() && styles.selectedYearButton]}
      onPress={() => {
        setSelectedYear(year.toString());
        setYearModalVisible(false);
      }}
    >
      <Text style={[styles.monthButtonText, selectedYear === year && { backgroundColor: 'red', color: 'white' }]}>{year}</Text>
    </TouchableOpacity>
  ));

  const goToAllHistoryAttendance = () => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
    setModalVisible(false);
    navigation.navigate('Month Attendance History');
    console.log('Month Attendance History Screen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === 'checkIn' ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => setActiveButton('checkIn')}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === 'checkIn' ? styles.activeButtonText : styles.inactiveButtonText,
              ]}
            >
              Check In Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === 'checkOut' ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => setActiveButton('checkOut')}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === 'checkOut' ? styles.activeButtonText : styles.inactiveButtonText,
              ]}
            >
              Check Out Summary
            </Text>
          </TouchableOpacity>
        </View>

        {activeButton === 'checkIn' && (
          <ScrollView style={{ width: '100%' }} vertical={true}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>

            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Monthly Check In</Text>
              <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
              <LineChart
                data={data}
                width={screenWidth + 200}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                fromZero={true}
                bezier
              >

              </LineChart>

              </ScrollView>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={goToAllHistoryAttendance}
              >
                <Text style={styles.viewAllButtonText}>View All History Attendance</Text>
              </TouchableOpacity>
            </View>
            <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.latestAttendanceContainer}>
        <Text style={styles.latestAttendanceTitle}>History Check In Today</Text>
        {latestData && latestData.messages ? (
          <View style={styles.latestAttendanceContainer}>
          <View style={[styles.cardRow, ]}>
            <Text style={[styles.cardRow, {textAlign:'center', color:'red'}]}>{latestData.messages}</Text>
          </View>
          </View>
        ) : (
          <View style={styles.latestAttendanceCard}>
            <View style={styles.cardIconContainer}>
              {/* Add Icon if needed */}
            </View>
            <View style={styles.cardTextContainer}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTextLabel}>Status</Text>
                <View style={[
                  styles.cardStatusContainer,
                  { backgroundColor: latestData.id_absensi_type === 1 ? 'green' : 'red' }
                ]}>
                  <Text style={styles.cardTextValueStatus}>
                    {latestData.id_absensi_type === 1 ? 'CHECK-IN' : 'CHECK-OUT'}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardTextLabel}>Time</Text>
                <Text style={styles.cardTextValue}>{latestData.waktu_absensi}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardTextLabel}>Date</Text>
                <Text style={styles.cardTextValue}>{latestData.tanggal_absensi}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewOnMapButton}
                onPress={viewOnMap}
              >
                <Text style={styles.viewOnMapButtonText}>View on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>

          </ScrollView>
        )}

{activeButton === 'checkOut' && (
  <ScrollView style={{ width: '100%' }} vertical={true}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
      {/* <TouchableOpacity
        style={styles.openModalButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textSelect}>Select Month: <Text style={[styles.openModalButtonText, { color: 'red' }]}>{selectedMonth}</Text></Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.openModalButton}
        onPress={() => setYearModalVisible(true)}
      >
        <Text style={styles.textSelect}>Select Year: <Text style={[styles.openModalButtonText, { color: 'red' }]}>{selectedYear}</Text></Text>
      </TouchableOpacity> */}
    </View>
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryText}>Monthly Check Out </Text>
      <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
        <LineChart
          data={data}
          width={screenWidth + 200}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero={true}
          bezier
        />
      </ScrollView>
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={goToAllHistoryAttendance}
      >
        <Text style={styles.viewAllButtonText}>View All History Attendance</Text>
      </TouchableOpacity>
    </View>
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.latestAttendanceContainer}>
        <Text style={styles.latestAttendanceTitle}>History Check Out Today</Text>
        {latestDataOut && latestDataOut.messages ? (
          <View style={styles.latestAttendanceContainer}>
          <View style={[styles.cardRow, ]}>
            <Text style={[styles.cardRow, {textAlign:'center', color:'red'}]}>{latestDataOut.messages}</Text>
          </View>
          </View>
        ) : (
          <View style={styles.latestAttendanceCard}>
            <View style={styles.cardIconContainer}>
              {/* Add Icon if needed */}
            </View>
            <View style={styles.cardTextContainer}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTextLabel}>Status</Text>
                <View style={[
                  styles.cardStatusContainer,
                  { backgroundColor: latestDataOut.id_absensi_type === 1 ? 'green' : 'red' }
                ]}>
                  <Text style={styles.cardTextValueStatus}>
                    {latestDataOut.id_absensi_type === 1 ? 'CHECK-IN' : 'CHECK-OUT'}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardTextLabel}>Time</Text>
                <Text style={styles.cardTextValue}>{latestDataOut.waktu_absensi}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardTextLabel}>Date</Text>
                <Text style={styles.cardTextValue}>{latestDataOut.tanggal_absensi}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewOnMapButton}
                onPress={viewOnMap}
              >
                <Text style={styles.viewOnMapButtonText}>View on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  </ScrollView>
)}




        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Month</Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {monthButtons}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={yearModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setYearModalVisible(!yearModalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Year</Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setYearModalVisible(!yearModalVisible)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {yearButtons}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const chartConfig = {
  backgroundColor: "#FFFFFF",
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 180, 66, ${opacity})`,
  style: {
    borderRadius: 8,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "1",
    stroke: "#FFB442",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#e74c3c',
  },
  inactiveButton: {
    backgroundColor: '#F1F1F1',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  inactiveButtonText: {
    color: '#e74c3c',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
  },
  viewAllButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
  },
  viewAllButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  openModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
  },
  openModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthButton: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  selectedMonthButton: {
    backgroundColor: '#e74c3c',
  },
  monthButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  yearButton: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  selectedYearButton: {
    backgroundColor: '#e74c3c',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  safeAreaView: {
    flex: 1,
    width: '100%',
  },
  latestAttendanceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  latestAttendanceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  latestAttendanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIconContainer: {
    marginRight: 20,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTextLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#777777',
  },
  cardTextValue: {
    fontSize: 18,
    color: '#333333',
  },
  cardTextValueStatus: {
    fontSize: 14,
    color: 'white',
  },
  cardStatusContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  viewOnMapButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#1E88E5',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  viewOnMapButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
