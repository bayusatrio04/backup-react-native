import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable, Alert, ActivityIndicator, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import axios from 'axios';
import { LineChart, PieChart } from 'react-native-chart-kit';
const currentMonthIndex = new Date().getMonth();
const currentYear = new Date().getFullYear();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const API_ENDPOINT = "https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/search";

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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
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
    fetchData(); // Panggil fetchData saat komponen di-mount
  }, []); 
  useEffect(() => {
    if (isSearching && selectedMonth && selectedYear) {
      fetchData();
      setIsSearching(false); // Set isSearching kembali ke false setelah fetch data selesai
    }
  }, [isSearching, selectedMonth, selectedYear]);

  const handleSearch = () => {
    setIsSearching(true); // Set isSearching menjadi true ketika tombol pencarian diklik
  };

  const filterDataByMonthAndYear = data => {
    return data.items ? data.items.filter(item => {
      const itemDate = new Date(item.tanggal_absensi);
      const itemMonth = itemDate.getMonth();
      const itemYear = itemDate.getFullYear();
      return itemMonth === months.indexOf(selectedMonth) && itemYear.toString() === selectedYear;
    }) : [];
  };

  const handleFetchError = error => {
    console.error("Error fetching data:", error);
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
          Authorization: `Bearer ${token}`
        }
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
  const renderBadge = (value) => {
    if (value === 'On-Time') {
      return (
        <View style={{ backgroundColor: 'green', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: 'white' }}>{value}</Text>
        </View>
      );
    } else if (value === 'Late') {
      return (
        <View style={{ backgroundColor: 'red', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: 'white' }}>{value}</Text>
        </View>
      );
    } else {
      return value;
    }
  };
  

  const renderAttendanceData = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (!filteredData || filteredData.length === 0) {
      return <Text>Data tidak ditemukan.</Text>;
    } else {
      return (
        <DataTable
          data={filteredData}
          colNames={['tanggal_absensi', 'waktu_absensi', 'latitude', 'longitude', 'keterangan']}
          colSettings={[
            { name: 'tanggal_absensi', type: COL_TYPES.STRING, width: '20%' },
            { name: 'waktu_absensi', type: COL_TYPES.STRING, width: '20%' },
            { name: 'latitude', type: COL_TYPES.STRING, width: '20%' },
            { name: 'longitude', type: COL_TYPES.STRING, width: '20%' },
            { name: 'keterangan', type: COL_TYPES.STRING, width: '25%', render: renderBadge },
          ]}
          noOfPages={2}
          backgroundColor='#fff'
          headerLabelStyle={{ color: 'grey', fontSize: 12 }}
        />
      );
    }
  };

  const monthButtons = months.map((month, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.monthButton, selectedMonth === month && styles.selectedMonthButton]}
      onPress={() => {
        setSelectedMonth(month);
        setModalVisible(false);
      }}
    >
      <Text style={[styles.monthButtonText, selectedMonth === month && { color: 'white' }]}>{month}</Text>
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
      <Text style={[styles.yearButtonText, selectedYear === year.toString() && { color: 'white' }]}>{year}</Text>
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.openModalButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.openModalButtonText}>{selectedMonth}</Text>
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
                <ScrollView>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    {monthButtons}
                  </View>
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

          <TouchableOpacity
            style={styles.openModalButton}
            onPress={() => setYearModalVisible(true)}
          >
            <Text style={styles.openModalButtonText}>{selectedYear}</Text>
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
                <ScrollView>
                  <View style={styles.yearButtonContainer}>
                    {yearButtons}
                  </View>
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

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.tableContainer}>
          {renderAttendanceData()}
        </ScrollView>
      </View>
      <View style={styles.totalDataContainer}>
        <Text style={styles.totalDataText}>Total data: </Text>
        <Text style={styles.totalDataText}>{totalData}</Text>
      </View>
      <View>
      {/* <PieChart
    data={
        [
        {
            name: "Jawa Barat",
            population: 48.0,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#000000",
            legendFontSize: 11
        },
        {
            name: "Jawa Timur",
            population: 39.2,
            color: "red",
            legendFontColor: "#000000",
            legendFontSize: 11
        },
        {
            name: "Jawa Tengah",
            population: 34.2,
            color: "yellow",
            legendFontColor: "#000000",
            legendFontSize: 11
        },
        {
            name: "Sumatera Utara",
            population: 14.2,
            color: "orange",
            legendFontColor: "#000000",
            legendFontSize: 11
        },
        {
            name: "Banten",
            population: 12.4,
            color: "green",
            legendFontColor: "#000000",
            legendFontSize: 11
        }
        ]
    }
    width={Dimensions.get("window").width - 50} // from react-native
    height={220}
    chartConfig={{
        color: (opacity = 1) => `#000000`,
        labelColor: (opacity = 1) => `#000000`,
        style: {
            borderRadius: 16
        }
    }}
    backgroundColor="#ffffff"
    accessor="population"
    paddingLeft="15"
    absolute
    style={{
        marginVertical: 8,
        borderRadius: 16
    }}
/> */}
      </View>
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  openModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff3300',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  openModalButtonText: {
    fontSize: 16,
    color: '#ffffff',
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
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monthButton: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedMonthButton: {
    backgroundColor: '#ff3620',
  },
  monthButtonText: {
    fontSize: 16,
  },
  yearButton: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedYearButton: {
    backgroundColor: '#f32121',
  },
  yearButtonText: {
    fontSize: 16,
  },
  yearButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
  },
  tableContainer: {
    width: '100%',
    marginTop: 20,
  },
  totalDataContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  totalDataText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
