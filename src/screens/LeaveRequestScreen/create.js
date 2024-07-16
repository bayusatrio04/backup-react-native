import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCalendar,
  faChevronLeft,
  faChevronRight,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import getDataSisaCutiTahunan from '../../api/getDataSisaCuti';
import useUserProfile from "../../api/getUserProfile/index";

const CreateLeaveRequestScreen = ({ navigation }) => {
  const [modalJenisVisible, setModalJenisVisible] = useState(false);
  const [modalTanggalMulaiVisible, setModalTanggalMulaiVisible] = useState(false);
  const [modalTanggalBerakhirVisible, setModalTanggalBerakhirVisible] = useState(false);
  const leaveTypes = ['Cuti Tahunan', 'Sakit', 'Cuti Melahirkan', 'Izin Tidak Masuk Kerja'];
  
  const { year, used_leave_days, remaining_leave_days, total_leave_days } = getDataSisaCutiTahunan();
  const {  email, nama_depan, position, nama_belakang } = useUserProfile();
  
  const [date, setDate] = useState(dayjs());
  const [employeeName, setEmployeeName] = useState(`${nama_depan} ${nama_belakang}`);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [agreed, setAgreed] = useState(0);

  const [formData, setFormData] = useState({
    nama_karyawan: `${nama_depan} ${nama_belakang}`,
    jenis_surat_pengajuan: '',
    tanggal_pengajuan: moment().format('YYYY-MM-DD'),
    tanggal_mulai: '',
    tanggal_berakhir: '',
    total_hari_pengajuan: '',
    alasan_pengajuan: '',
    status_permohonan: 'Sedang Diproses',
    employee_signature: '1',
    manager_signature: '0',
  });
  useEffect(() => {
    if (nama_depan && nama_belakang) {
      setEmployeeName(`${nama_depan} ${nama_belakang}`);
    }
  }, [nama_depan, nama_belakang]);
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      nama_karyawan: employeeName,
    }));
  }, [employeeName]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const daysDifference = end.diff(start, 'day') ;
      setFormData(prevState => ({ ...prevState, total_hari_pengajuan: daysDifference.toString() }));
    }
  }, [startDate, endDate]);

  const handleJenis = () => setModalJenisVisible(true);

  const toggleLeaveType = (type) => {
    setLeaveType(type);
    setFormData(prevState => ({ ...prevState, jenis_surat_pengajuan: type }));
    setModalJenisVisible(false);
  };

  const handleDateChangeMulai = (params) => {
    const selectedDate = dayjs(params.date);
    setDate(selectedDate);
    setStartDate(selectedDate.format('YYYY-MM-DD'));
    setFormData(prevState => ({
      ...prevState,
      tanggal_mulai: selectedDate.format('YYYY-MM-DD') // Set formatted date string in formData
    }));
  };

  const handleDateChangeBerakhir = (params) => {
    const selectedDate = dayjs(params.date); // Assuming params.date is a date object or a string
    setDate(selectedDate);
    setEndDate(selectedDate.format('YYYY-MM-DD')); // Format date as string for endDate
    setFormData(prevState => ({
      ...prevState,
      tanggal_berakhir: selectedDate.format('YYYY-MM-DD') // Set formatted date string in formData
    }));
  };

  const handleReasonChange = (text) => {
    setReason(text); // Update local state
    setFormData(prevState => ({
      ...prevState,
      alasan_pengajuan: text // Update formData with the reason
    }));
  };
  const handleTanggalMulaiOKE = () => setModalTanggalMulaiVisible(false);

  const handleTanggalBerakhirOKE = () => setModalTanggalBerakhirVisible(false);

  const validateFormData = () => {
    if (!formData.jenis_surat_pengajuan || !startDate || !endDate || !formData.alasan_pengajuan) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {
    console.log('Submitting form data:', formData);
    if (!validateFormData()) return;
  
    if (!agreed) {
      Alert.alert('Persetujuan Diperlukan', 'Silahkan klik setuju untuk persyaratan cuti izin karyawan', [{ text: 'OK' }]);
      return;
    }
  
    const formattedFormData = {
      ...formData,
      total_hari_pengajuan: parseInt(formData.total_hari_pengajuan, 10),
      tanggal_mulai: startDate,
      tanggal_berakhir: endDate,
      alasan_pengajuan: reason
    };
  
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(
        'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-cuti-izin/create',
        formattedFormData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.status) {
        Alert.alert('Success', 'Cuti izin berhasil diajukan');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Terjadi kesalahan saat mengajukan cuti izin');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat mengajukan cuti izin');
      console.error('Submit Error:', error);
    }
  };
  

  const goToHome = () => navigation.navigate('Home');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={goToHome}>
          <Text style={styles.backButton}>
            <FontAwesomeIcon icon={faChevronLeft} size={25} color="#333" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Formulir Cuti Izin Kerja</Text>
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
      <View style={styles.formContainer}>
        <View style={styles.whiteBox}>
          <Text style={styles.headerWhiteBox}>Detail Informasi Karyawan</Text>
          <Text>Nama Karyawan</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Karyawan"
            value={formData.nama_karyawan}
            editable={false}
          />
        </View>

        <View style={styles.whiteBox}>
          <Text style={styles.headerWhiteBox}>Detail Pengajuan Cuti Izin</Text>
          <Text>Jenis Permohonan</Text>
          <TouchableOpacity onPress={handleJenis}>
            <View style={[styles.buttonCont, styles.button]}>
              <Text style={styles.buttonText}>{leaveType || 'Pilih jenis permohonan...'}</Text>
              <FontAwesomeIcon icon={faChevronRight} size={20} color="#56AEFF" />
            </View>
          </TouchableOpacity>

          <Text>Tanggal Mulai</Text>
          <TouchableOpacity onPress={() => setModalTanggalMulaiVisible(true)}>
            <View style={[styles.buttonCont, styles.button]}>
              <Text style={styles.buttonText}>{startDate ? `Mulai: ${startDate}` : 'Pilih Tanggal Mulai'}</Text>
              <FontAwesomeIcon icon={faCalendar} size={25} color="#56AEFF" />
            </View>
          </TouchableOpacity>

          <Text>Tanggal Berakhir</Text>
          <TouchableOpacity onPress={() => setModalTanggalBerakhirVisible(true)}>
            <View style={[styles.buttonCont, styles.button]}>
              <Text style={styles.buttonText}>{endDate ? `Berakhir: ${endDate}` : 'Pilih Tanggal Berakhir'}</Text>
              <FontAwesomeIcon icon={faCalendar} size={25} color="#56AEFF" />
            </View>
          </TouchableOpacity>

          <Text>Alasan melakukan permohonan</Text>
          <TextInput
            style={styles.input}
            placeholder="Berikan alasan yang relevan dengan jenis permohonan"
            value={reason}
            onChangeText={handleReasonChange}
            multiline
          />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxText}>Setuju dengan persyaratan perusahaan</Text>
          <CheckBox
            value={agreed === 1}
            onValueChange={(newValue) => setAgreed(newValue ? 1 : 0)}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit}>
          <View style={styles.submitButton}>
            <Text style={styles.submitText}>Kirim</Text>
          </View>
        </TouchableOpacity>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalJenisVisible}
        onRequestClose={() => setModalJenisVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pilih Jenis Permohonan</Text>
            <View style={styles.gridContainer}>
              {leaveTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.gridItem, styles.button]}
                  onPress={() => toggleLeaveType(type)}
                >
                  <View style={styles.leaveTypeContainer}>
                    <Text style={styles.buttonText}>{type}</Text>
                    {leaveType === type ? (
                      <FontAwesomeIcon icon={faCheck} size={20} color="#56AEFF" />
                    ) : (
                      <Text style={styles.pilihText}>Pilih</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setModalJenisVisible(false)}>
              <View style={[styles.buttonCont, styles.button]}>
                <Text style={styles.buttonText}>Tutup</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalTanggalMulaiVisible}
        onRequestClose={() => setModalTanggalMulaiVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pilih Tanggal Mulai</Text>
            <DateTimePicker
              mode="single"
              date={date.toDate()}
              onChange={handleDateChangeMulai}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalTanggalMulaiVisible(false)}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.searchButton]}
                onPress={handleTanggalMulaiOKE}
              >
                <Text style={styles.modalButtonText}>Oke</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalTanggalBerakhirVisible}
        onRequestClose={() => setModalTanggalBerakhirVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pilih Tanggal Berakhir</Text>
            <DateTimePicker
              mode="single"
              date={date.toDate()}
              onChange={handleDateChangeBerakhir}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalTanggalBerakhirVisible(false)}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.searchButton]}
                onPress={handleTanggalBerakhirOKE}
              >
                <Text style={styles.modalButtonText}>Oke</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </View>
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
    marginBottom: 20,
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
    borderWidth:1,
    borderColor:'#ddd'
  },
  buttonText: {
    color: '#333',
    fontSize: 12,
  },

  formContainer: {
    marginTop: 20,
  },
  whiteBox:{
    backgroundColor:'#fff',
    padding:20,
    borderRadius:20,
    marginTop:10
  },
  headerWhiteBox:{
    marginBottom:32,
    fontWeight:'bold'
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    color:'#333'
  },
  textarea: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    height: 100,
  },
  datePicker: {
    width: '100%',
    marginBottom: 10,
  },
  photoUpload: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  photoUploadText: {
    color: '#666',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },




  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  searchButton: {
    backgroundColor: '#56AEFF',
  },
  modalButtonText: {
    color: '#fff',
  },



  gridContainer: {
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',alignContent:'center'
  },
  gridItem: {
    flexDirection: 'row', // Ensure items are in a row
    padding: 10,
    alignItems: 'center',

    marginBottom: 10, // Space between items
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  leaveTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    width: '100%',
  },
  pilihText: {
    color: '#888', // Gray color for "Pilih"
    fontSize: 14,
    marginLeft: 10, // Space between type and "Pilih" text
  },
});

export default CreateLeaveRequestScreen;
