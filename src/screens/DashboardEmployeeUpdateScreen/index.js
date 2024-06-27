import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCalendar, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-native-modern-datepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SweetAlert from 'react-native-sweet-alert';

const DashboardEmployeeUpdateScreen = ({ route,navigation }) => {
    const { id } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
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

    useEffect(() => {
        fetchPositions();
        fetchEmployeeDetails();
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

    const fetchEmployeeDetails = async () => {
       
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log(token);
            console.log(id);
            if (!token) {
                throw new Error('No token found');
            }
    
            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees/view&id=${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            const employee = response.data;
            setFormData({
                nama_depan: employee.nama_depan,
                nama_belakang: employee.nama_belakang,
                email: employee.email,
                tanggal_lahir: employee.tanggal_lahir,
                jenis_kelamin: employee.jenis_kelamin,
                status_nikah: employee.status_nikah,
                jumlah_tanggungan: employee.jumlah_tanggungan,
                no_telepon: employee.no_telepon,
                position_id: employee.position_id,
                type_karyawan: employee.type_karyawan
            });
            const selectedPosition = positions.find(position => position.id === employee.position_id);
            setSelectedPosition(selectedPosition ? selectedPosition.position_name : null);
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

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
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees/update&id=${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            console.log('Server Response:', response.data);

            if (response.status === 200) {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Berhasil memperbarui data karyawan',
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
                  navigation.navigate('Employee Management');
                  navigation.navigate('Employees');
                console.log('Data karyawan berhasil diperbarui di database!');
            } else {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Gagal memperbarui data karyawan di database.',
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
                console.error('Gagal memperbarui data karyawan di database.');
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
                    <Text style={styles.headerText}>Update Employee</Text>
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
                                disabled
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <View style={styles.dateContainer}>
                        <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                            <FontAwesomeIcon icon={faCalendar} size={20} color="#9e9e9e" />
                        </TouchableOpacity>
                        <TextInput
                            style={{ borderColor: 'red' }}
                            mode="outlined"
                            activeUnderlineColor="transparent"
                            theme={{
                                roundness: 25,
                            }}
                            label="Date of Birth"
                            value={formData.tanggal_lahir}
                            disabled
                        />
                    </View>
                </View>

                <Modal visible={datePickerVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <DatePicker
                            mode="calendar"
                            onDateChange={handleDateChange}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setDatePickerVisible(false)}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                </Modal>

                <View style={styles.formGroup}>
                    <RadioButton.Group
                        onValueChange={value => handleChange('jenis_kelamin', value)}
                        value={formData.jenis_kelamin}
                    >
                        <View style={styles.radioContainer}>
                            <RadioButton.Item label="Male" value="L" />
                            <RadioButton.Item label="Female" value="P" />
                        </View>
                    </RadioButton.Group>
                </View>

                <View style={styles.formGroup}>
                    <RadioButton.Group
                        onValueChange={value => handleChange('status_nikah', value)}
                        value={formData.status_nikah}
                    >
                        <View style={styles.radioContainer}>
                            <RadioButton.Item label="TK (Tidak Nikah)" value="TK" />
                            <RadioButton.Item label="K (Nikah)" value="K" />
                        </View>
                    </RadioButton.Group>
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
                                label="Jumlah Tanggungan"
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
                                theme={{
                                    roundness: 25,
                                }}
                                label="Phone Number"
                                onChangeText={handlePhoneChange}
                                value={formData.no_telepon}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainerStyle}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={styles.buttonPosition}
                            >
                                <Text style={styles.buttonText}>
                                    {selectedPosition ? selectedPosition : 'Select Position'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <ScrollView>
                                {positionsButton}
                            </ScrollView>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <FontAwesomeIcon icon={faTimesCircle} size={30} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
                                label="Employee Type"
                                onChangeText={value => handleChange('type_karyawan', value)}
                                value={formData.type_karyawan}
                                disabled
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.submitButton}
                >
                    <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    dasarRed: {
        backgroundColor: '#587cff',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:30,
        padding:30,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    contentWhite: {
        backgroundColor: '#fff',
        padding: 20,
    },
    containerForm: {
        flexDirection: 'row',
    },
    formGroup: {
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
    },
    inputContainerStyle: {
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonPosition: {
        backgroundColor: '#90a7fc',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#1b2401',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    submitButton: {
        backgroundColor: '#587cff',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    positionButton: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    selectedPositionButton: {
        backgroundColor: '#ff3c3c',
    },
    buttonText: {
        color: '#fff',
    },
});

export default DashboardEmployeeUpdateScreen;
