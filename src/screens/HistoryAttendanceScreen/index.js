import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, Pressable, SafeAreaView, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  {fetchlatestAbsensiLog}  from '../../api/getLatestAttendance/index';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);


export default function HistoryAttendance () {

  const [isConnected, setIsConnected] = useState(true);
  const [activeButton, setActiveButton] = useState('checkIn');
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const currentMonthIndex = new Date().getMonth();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
  const screenWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);

  const [latestData, setLatestData] = useState({});const [locationName, setLocationName] = useState('');
  
  const navigation = useNavigation();
  const initialRegion = {
    latitude: 37.78825, // Initial latitude
    longitude: -122.4324, // Initial longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Alert.alert('No Internet Connection', 'Check your internet connection!');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);
  const fetchDataLatest = async () => {
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
      // fetchLocationName(data.longitude, data.latitude);
      console.log('latest data : ',data); 
      return data;
    } catch (error) {
      console.error('Gagal mendapatkan data absensi log:', error.message);
      throw error;
    }
  };
  useEffect(() => {
    const fetchAndSetLatestData = async () => {
      try {
        const data = await fetchDataLatest();
        setLatestData(data);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchAndSetLatestData();
  }, []);

  
  
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
      setItem(json);
      console.log('data total check in : ',json);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data from the API.');
    } finally {
      setLoading(false);
    }
  };
    const totalJun = item.length > 0 ? item[0].Total:'0';
    console.log(totalJun);
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: 
        [
          20, 
          25, 
          item.length > 0 ? item[0].Total:'0', 
          item.length > 0 ? item[0].Total:'0', 
          item.length > 0 ? item[0].Total:'0', 
          item.length > 0 ? item[0].Total:'0', 
          
          10, 30, 50, 70, 90, 100],
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
      <Text style={[styles.monthButtonText, selectedMonth === month && { backgroundColor: 'red', color:'white' }]}>{month}</Text>
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
     <Text style={[styles.monthButtonText, selectedYear === year && { backgroundColor: 'red', color:'white' }]}>{year}</Text>
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
              <TouchableOpacity
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
              </TouchableOpacity>
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Monthly Check In - {selectedMonth}</Text>
              <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
                <LineChart
                  data={data}
                  width={screenWidth * 1.3}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 180, 66, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#fff"
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                  renderDotContent={({ x, y, index }) => {
                    return (
                      index === selectedMonthIndex && (
                        <View
                          key={index}
                          style={{
                            position: 'absolute',
                            top: y - 12,
                            left: x - 12,
                            backgroundColor: 'rgba(255, 180, 66, 0.7)',
                            borderRadius: 12,
                            width: 24,
                            height: 24,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: 10 }}>{data.datasets[0].data[index]}</Text>
                        </View>
                      )
                    );
                  }}
                />
              </ScrollView>
            </View>
            <SafeAreaView style={styles.overviewContainer}>
              <View style={styles.overviewBox}>
                <Text style={styles.overviewTitle}>Total Check In</Text>
                <Text style={styles.overviewNumber}>{item.length > 0 ? item[0].Total:'0'}</Text>
              </View>
              <View style={styles.overviewBox}>
                <Text style={styles.overviewTitle}>Total Late</Text>
                <Text style={styles.overviewNumber}>{item.length > 0 ? item[0]['Total Late']:'0'}</Text>
              </View>
            </SafeAreaView>
            <SafeAreaView style={styles.overviewContainer}>
              <View style={styles.overviewBox}>
                <Text style={styles.overviewTitle}>Total Hours</Text>
                <Text style={styles.overviewNumber}>{item.length > 0 ? item[0]['Working Hours']:'0'}</Text>
              </View>
              <View style={styles.overviewBox}>
                <Text style={styles.overviewTitle}>On-Time</Text>
                <Text style={styles.overviewNumber}>{item.length > 0 ? item[0]['Total Ontime']:'0'}</Text>
              </View>
            </SafeAreaView>
            <View style={styles.recentCheckInContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={styles.recentCheckInTitle}>Today's Check-In History</Text>
                <TouchableOpacity onPress={goToAllHistoryAttendance}><Text style={{ color: 'blue', textDecorationLine: 'underline' }}>View all</Text></TouchableOpacity>
              </View>
              <ScrollView style={styles.recentCheckInList}>
                <View style={styles.recentCheckInItem}>
                  <Text style={styles.recentCheckInTime}>{latestData ? latestData.waktu_absensi : 'Belum ada kehadiran'}</Text>
                  
                  <Text style={styles.recentCheckInLocation}>{latestData ? latestData.waktu_absensi : 'Belum ada kehadiran'}</Text>
                  <Text style={styles.recentCheckInStatus}>Completed</Text>
                </View>
                <View style={styles.recentCheckInItem}>
                  <Text style={styles.recentCheckInTime}>08:15 AM</Text>
                  <Text style={styles.recentCheckInLocation}>Conference Room</Text>
                  <Text style={styles.recentCheckInStatus}>Completed</Text>
                </View>
                {/* Add more recent check-in items here */}
              </ScrollView>
            </View>

          </ScrollView>
        )}

        {activeButton === 'checkOut' && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>This is the Attendance Check Out Summary content.</Text>
          </View>
        )}
      </View>
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
            <ScrollView>
              {monthButtons.map((button, index) => (
                <View key={index} style={{ marginHorizontal: 5 }}>
                  {button}
                </View>
              ))}
            </ScrollView>
          </View>
          <Pressable
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
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
            <ScrollView>
              {yearButtons.map((button, index) => (
                <View key={index} style={{ marginHorizontal: 5 }}>
                  {button}
                </View>
              ))}
            </ScrollView>
          </View>
          <Pressable
            style={styles.modalCloseButton}
            onPress={() => setYearModalVisible(!yearModalVisible)}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 100,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#EC353A',
  },
  inactiveButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EC353A',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: 'white',
  },
  inactiveButtonText: {
    color: '#EC353A',
  },
  summaryContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  textSelect: {
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  overviewContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    top: 20,
    columnGap: 5,
  },
  overviewBox: {
    backgroundColor: '#fff',
    width: '50%',
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EC353A',
  },
  recentCheckInContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom:50,
  },
  recentCheckInTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentCheckInList: {
    maxHeight: 120,
  },
  recentCheckInItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recentCheckInTime: {
    fontSize: 14,
    marginRight: 10,
  },
  recentCheckInLocation: {
    fontSize: 14,
    color: '#666',
  },
  recentCheckInStatus: {
    fontSize: 14,
    color: '#41ff77',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 60,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff0000',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthButtonText: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
