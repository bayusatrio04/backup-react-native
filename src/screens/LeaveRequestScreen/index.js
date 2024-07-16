import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, Modal, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faChevronLeft, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import getDataSisaCutiTahunan from '../../api/getDataSisaCuti';
const LeaveRequestScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(dayjs().format('YYYY-MM-DD'));
  const [date, setDate] = useState(dayjs());
  const [searchResults, setSearchResults] = useState([]);
  const { employee_id, year, used_leave_days, remaining_leave_days, total_leave_days } = getDataSisaCutiTahunan();
  const handleSearch = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-cuti-izin/get-absensi-cuti', {
        params: { tanggal_pengajuan: searchQuery },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSearchResults(response.data.data || []);
      console.log('Search Results:', response.data);
      setModalVisible(false);
    } catch (error) {
      console.error('Search Error:', error);
      Alert.alert('Error', 'Failed to fetch data');
    }
  };
  const handleDetailPress = (item) => {
    navigation.navigate('DetailScreen', { item });
  };
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Image source={require('../../assets/images/cuti_v2.png')} style={styles.emptyStateImage} />
          <Text style={styles.emptyStateText}>Tidak ada data yang dimaksud.</Text>
        </View>
      );
    }

    return searchResults.map((item, index) => (
      <View key={index} style={styles.resultItem}>
        <Text>{item.nama_karyawan}</Text>
        <Text>{item.jenis_surat_pengajuan}</Text>
        <Text>{item.tanggal_pengajuan}</Text>
        <Text>{item.alasan_pengajuan}</Text>
        <TouchableOpacity onPress={() => handleDetailPress(item)} style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Detail</Text>
          <FontAwesomeIcon icon={faArrowRight} size={15} color="#56AEFF" />
        </TouchableOpacity>
      </View>
    ));
  };

  const handleDateChange = (params) => {
    const selectedDate = dayjs(params.date);
    setDate(selectedDate);
    setSearchQuery(selectedDate.format('YYYY-MM-DD'));
  };

  const goToHome = () => {
    navigation.navigate('Home');
    console.log('Home Screen');
  };

  const goToCreateLetters = () => {
    navigation.navigate('Formulir Cuti Izin Kerja');
    console.log('Formulir Cuti Izin Kerja Screen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={goToHome}>
          <Text style={styles.backButton}>
            <FontAwesomeIcon icon={faChevronLeft} size={25} color="#333" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cuti Izin Kerja</Text>
      </SafeAreaView>
      <View style={styles.infoContainer}>
        <View style={[styles.infoBox, styles.blueBox]}>
          <Text style={styles.infoTitle}>Jumlah Cuti</Text>
          <Text style={styles.infoNumber}>{total_leave_days ? total_leave_days : '0'}</Text>
        </View>
        <View style={[styles.infoBox, styles.redBox]}>
          <Text style={styles.infoTitle}>Sisa Cuti</Text>
          <Text style={styles.infoNumber}>{remaining_leave_days ? remaining_leave_days : '0'}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={[styles.infoBox, styles.greenBox]}>
          <Text style={styles.infoTitle}>Cuti Terpakai</Text>
          <Text style={styles.infoNumber}>{used_leave_days ? used_leave_days : '0'}</Text>
        </View>
        <View style={[styles.infoBox, styles.yellowBox]}>
          <Text style={styles.infoTitle}>Year</Text>
          <Text style={styles.infoNumber}>{year ? year : '-'}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={goToCreateLetters}>
        <View style={[styles.buttonCont, styles.button]}>
          <Text style={styles.buttonText}>Buat surat permohonan Cuti Izin</Text>
          <FontAwesomeIcon icon={faPlus} size={25} color="#56AEFF" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={[styles.buttonCont, styles.button]}>
          <Text style={styles.buttonText}>Cari Riwayat Cuti atau Izin</Text>
          <FontAwesomeIcon icon={faSearch} size={25} color="#56AEFF" />
        </View>
      </TouchableOpacity>
      <View style={styles.resultsContainer}>
        <Text style={styles.dateLabel}>Tanggal yang dipilih: {searchQuery}</Text>
        {renderSearchResults()}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cari Riwayat Cuti atau Izin</Text>
            <DateTimePicker
              mode="single"
              date={date.toDate()}
              onChange={handleDateChange}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.searchButton]}
                onPress={handleSearch}
              >
                <Text style={styles.modalButtonText}>Cari</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    paddingVertical: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  blueBox: {
    backgroundColor: '#E6F7FF',
    borderWidth: 1,
    borderColor: '#99D8FF',
  },
  redBox: {
    backgroundColor: '#FFF1F0',
    borderWidth: 1,
    borderColor: '#FDB4AF',
  },
  greenBox: {
    backgroundColor: '#F6FFED',
    borderWidth: 1,
    borderColor: '#C8EDAA',
  },
  yellowBox: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFEDB3',
  },
  infoTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  infoNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultType: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  resultDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  resultReason: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E6F7FF',
    borderWidth: 1,
    borderColor: '#99D8FF',
  },
  detailButtonText: {
    color: '#56AEFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#56AEFF',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default LeaveRequestScreen;
