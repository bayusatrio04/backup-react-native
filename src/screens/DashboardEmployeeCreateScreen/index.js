import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCalendar, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-native-modern-datepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SweetAlert from 'react-native-sweet-alert';
import PositionModal from "../../../components/PositionModal";


const DashboardEmployeeCreateScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = async () => {
        try {
            const response = await axios.get(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees'
            );
            setPositions(response.data);
        } catch (error) {
            console.error('Error fetching positions:', error);
        }
    };

    const [formData, setFormData] = useState({
        nama_depan: '',
        nama_belakang: '',
        email: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        status_nikah: '',
        jumlah_tanggungan: '',
        no_telepon: '',
        position_id: '',
        type_karyawan: ''
    });

    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const goToEmployeeManagement = () => {
        navigation.navigate('Employees');
        console.log('Employees Screen');
    };

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        });
    };
    const handlePhoneChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        handleChange('no_telepon', numericValue);
    };
    const handleDateChange = (date) => {
        const [year, month, day] = date.split(/[-/]/);
        const formattedDate = `${year}-${month}-${day}`;
        handleChange('tanggal_lahir', formattedDate);
        setDatePickerVisible(false);
    };

    const positionsButton = positions.map((position, index) => (
        <TouchableOpacity
          key={position.id}
          style={[styles.positionButton, selectedPosition === position.position_name && styles.selectedPositionButton]}
          onPress={() => {
            setSelectedPosition(position.position_name);
            handlePositionChange(position.id);
            setModalVisible(false); // Close modal after selecting a position
          }}
        >
            <View style={styles.button}>
                <Text style={styles.buttonText}>{position.position_name}</Text>
            </View>
        </TouchableOpacity>
    ));

    const handlePositionChange = (positionId) => {
        setFormData({
            ...formData,
            position_id: positionId
        });
    };

    const handleSubmit = async () => {
        for (const key in formData) {
            if (!formData[key]) {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Mohon lengkapi semua bidang formulir.',
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#c71515',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'error',
                    cancellable: true,
                    subTitleStyle: {
                      fontSize: 40
                    }
                  });
                return;
            }
        }
        console.log(formData);
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No token found');
        }

        try {
            const response = await axios.post(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            console.log('Server Response:', response.data);

            if (response.status === 201) {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Berhasil menambah data karyawan',
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#c71515',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'success',
                    cancellable: true,
                    subTitleStyle: {
                      fontSize: 40
                    }
                  });
                console.log('Data karyawan berhasil disimpan ke database!');
                setFormData({
                    nama_depan: '',
                    nama_belakang: '',
                    email: '',
                    tanggal_lahir: '',
                    jenis_kelamin: '',
                    status_nikah: '',
                    jumlah_tanggungan: '',
                    no_telepon: '',
                    position_id: '',
                    type_karyawan: ''
                });
                navigation.navigate('Employee Management');
                navigation.navigate('Employees');
            } else {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Gagal menyimpan data karyawan ke database.',
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#c71515',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'error',
                    cancellable: true,
                    subTitleStyle: {
                      fontSize: 40
                    }
                  });
                console.error('Gagal menyimpan data karyawan ke database.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data[0].message;
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: errorMessage,
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#c71515',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'error',
                    cancellable: true,
                    subTitleStyle: {
                      fontSize: 40
                    }
                  });
            } else {
                console.error('Terjadi kesalahan:', error.message);
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.dasarRed}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={goToEmployeeManagement}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Create Employee</Text>
                </View>
            </View>

            <View style={styles.contentWhite}>
                <View style={styles.containerForm}>
                    <View style={[styles.formGroup, { flex: 0.5 }]}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainerStyle}>
                                <TextInput
                                    style={{ borderColor: 'red' }}
                                    mode="outlined"
                                    activeUnderlineColor="transparent"
                                    theme={{
                                        roundness: 25,
                                    }}
                                    label="First Name"
                                    onChangeText={value => handleChange('nama_depan', value)}
                                    value={formData.nama_depan}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.formGroup, { flex: 0.5 }]}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainerStyle}>
                                <TextInput
                                    style={{ borderColor: 'red' }}
                                    mode="outlined"
                                    activeUnderlineColor="transparent"
                                    theme={{
                                        roundness: 25,
                                    }}
                                    label="Last Name"
                                    onChangeText={value => handleChange('nama_belakang', value)}
                                    value={formData.nama_belakang}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainerStyle}>
                            <TextInput
                                style={{ borderColor: 'red' }}
                                mode="outlined"
                                activeUnderlineColor="transparent"
                                theme={{
                                    roundness: 25,
                                }}
                                label="Email"
                                onChangeText={value => handleChange('email', value)}
                                value={formData.email}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.label}>Date of Birth: <Text style={styles.labelDate}>{formData.tanggal_lahir}</Text> </Text>
                        <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                            <FontAwesomeIcon icon={faCalendar} size={30} color='#6759ff' style={{ left: 200 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        {datePickerVisible && (
                            <>
                                <TouchableOpacity onPress={() => setDatePickerVisible(false)}>
                                    <FontAwesomeIcon icon={faTimesCircle} size={20} color="red" />
                                    <Text>close</Text>
                                </TouchableOpacity>
                                <DatePicker
                                    mode="calendar"
                                    onSelectedChange={handleDateChange}
                                />
                            </>
                        )}
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainerStyle}>
                            <TextInput
                                style={{ borderColor: 'red' }}
                                mode="outlined"
                                activeUnderlineColor="transparent"
                                theme={{
                                    roundness: 25,
                                }}
                                label="Gender"
                                onChangeText={value => handleChange('jenis_kelamin', value)}
                                value={formData.jenis_kelamin}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.labelDate}>Marital Status:</Text>
                    <View style={styles.radioButtonContainer}>
                        <View style={styles.radioButton}>
                            <Text style={[styles.labelDate, {fontWeight:'bold', alignSelf:'center', top:30}]}>TK (Belum Nikah)</Text>
                            <RadioButton
                                value="TK"
                                status={formData.status_nikah === 'TK' ? 'checked' : 'unchecked'}
                                onPress={() => handleChange('status_nikah', 'TK')}
                            />
                        </View>
                        <View style={styles.radioButton}>
                            <Text style={[styles.labelDate, {fontWeight:'bold', alignSelf:'center', top:30}]}>K (Nikah)</Text>
                            <RadioButton
                                value="K"
                                status={formData.status_nikah === 'K' ? 'checked' : 'unchecked'}
                                onPress={() => handleChange('status_nikah','K')}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainerStyle}>
                            <TextInput
                                style={{ borderColor: 'red' }}
                                mode="outlined"
                                activeUnderlineColor="transparent"
                                theme={{
                                    roundness: 25,
                                }}
                                label="Punya anak berapa? (0) jika belum punya"
                                onChangeText={value => handleChange('jumlah_tanggungan', value)}
                                value={formData.jumlah_tanggungan}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainerStyle}>
                            <TextInput
                                style={{ borderColor: 'red' }}
                                mode="outlined"
                                activeUnderlineColor="transparent"
                                keyboardType="numeric"
                                theme={{
                                    roundness: 25,
                                }}
                                label="Phone Number"
                                onChangeText={value => handleChange('no_telepon', value)}
                                value={formData.no_telepon}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={styles.buttonPosition}
                        onPress={() => setModalVisible(true)} // Buka modal ketika tombol ditekan
                    >
                        <Text style={styles.buttonText}>
                            {selectedPosition ? selectedPosition : 'Choose Posisi jobs'} {/* Ganti teks tombol dengan posisi yang dipilih jika ada, jika tidak tampilkan teks default */}
                        </Text>
                    </TouchableOpacity>
                  
                    </View>
                </View>

                
                
                <View style={styles.formGroup}>
                    <Text style={styles.labelDate}>Type Karyawan</Text>
                    <View style={styles.radioButtonContainer}>
                        <View style={styles.radioButton}>
                            <Text style={[styles.labelDate, {fontWeight:'bold', alignSelf:'center', top:30}]}>Full Time</Text>
                            <RadioButton
                                value="Full Time"
                                status={formData.type_karyawan === 'Full Time' ? 'checked' : 'unchecked'}
                                onPress={() => handleChange('type_karyawan', 'Full Time')}
                            />
                        </View>
                        <View style={styles.radioButton}>
                            <Text style={[styles.labelDate, {fontWeight:'bold', alignSelf:'center', top:30}]}>Contract</Text>
                            <RadioButton
                                value="Contract"
                                status={formData.type_karyawan === 'Contract' ? 'checked' : 'unchecked'}
                                onPress={() => handleChange('type_karyawan','Contract')}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                setSelectedPosition(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView>
                    <View style={styles.yearButtonContainer}>
                        {positionsButton}
                    </View>
                    </ScrollView>
                </View>
                <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setSelectedPosition(!modalVisible)}
                >
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                </Pressable>
                </View>
            </Modal>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    dasarRed: {
        backgroundColor: '#6759ff',
        height: 200, // Adjust the height as needed
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40
    },
    contentWhite: {
        backgroundColor: '#efefef',
        width: '100%',
        flex: 1,
        borderRadius: 30,
        padding: 30,
        marginTop: -90, // Adjust to position the white content area correctly over the red background
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#ffffff',
        marginLeft: 30
    },
    notificationButton: {
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row', // Ensure icon and text are in a row
        alignItems: 'center', // Center items vertically
        borderLeftWidth: 1.5,
        borderLeftColor: '#EC353A',
        backgroundColor: '#fff',
        padding: 20,
        margin: 8,
        borderRadius: 8,
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
        shadowOpacity: 0.2, // For iOS shadow
        shadowRadius: 8, // For iOS shadow
    },
    fullWidth: {
        margin: 8,
    },
    menuText: {
        marginLeft: 10, // Add margin to separate icon and text
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    containerForm:{

        flexDirection:'row'
    },
    formGroup: {
        marginBottom: 20,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        padding: 10,
        fontSize: 16,
    },
    inputContainerStyle: {
        margin: 8,
      },
      dateContainer:{
        flexDirection:'row',
        padding:15,
        backgroundColor:'#ffffff',
        borderRadius:25
      },
    labelDate: {
        fontSize: 16,
        color:'#6759ff',
        marginBottom: 5,
    
    },
    button: {
        backgroundColor: '#6759ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonPosition: {
        backgroundColor: '#1e0490',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    selectedPositionButton: {
        backgroundColor: '#585858',
      },
      positionButton: {
        padding: 10,
        borderRadius: 5,
        margin: 5,
        backgroundColor: '#f0f0f0',
      },
});

export default DashboardEmployeeCreateScreen;