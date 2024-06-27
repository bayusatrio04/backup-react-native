import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SweetAlert from 'react-native-sweet-alert';
import moment from 'moment';

const DashboardBasicSalaryCreateScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [salaries, setSalaries] = useState([]);
    const [selectedSalary, setSelectedSalary] = useState(null);

    useEffect(() => {
        fetchSalaries();
    }, []);

    const fetchSalaries = async () => {
        try {
            const response = await axios.get(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees-salaries'
            );
            setSalaries(response.data);
        } catch (error) {
            console.error('Error fetching salaries:', error);
        }
    };

    const [formData, setFormData] = useState({
        position_name: '',
        description: '',
        position_salary_id: '',
        created_at: '',
        updated_at: '',

    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        });
    };
    const handleSalarySelect = (salary) => {
        setSelectedSalary(salary);
        handleChange('position_salary_id', salary.id);
        setModalVisible(false);
    };
    const handleSubmit = async () => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedFormData = {
            ...formData,
            created_at: currentDateTime,
            updated_at: updatedDateTime,
        };
        for (const key in updatedFormData) {
            if (!updatedFormData[key]) {
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

        console.log(updatedFormData);
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No token found');
        }

        try {
            const response = await axios.post(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees/create',
                updatedFormData,
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
                    subTitle: 'Berhasil Menambah Data Posisi',
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
                console.log('Data Posisi berhasil disimpan ke database!');
                setFormData({
                    percentage: '',
                    masa_berlaku: '',
                    
                });
                navigation.navigate('Employee Management');
               
            } else {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Gagal menyimpan data posisi ke database.',
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
                console.error('Gagal menyimpan data posisi ke database.');
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

    const goToTax = () => {
        navigation.navigate('Employee Management');
        console.log('Employee Management Screen');
    };
    const formatCurrency = (amount) => {
        if (typeof amount === 'string') {
            amount = parseFloat(amount); // Parse string to number
        }
        if (isNaN(amount)) {
            return 'Rp. 0';
        }
        return ` ${amount.toLocaleString('id-ID', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'IDR',
        })}`;
    };
    return (
        <ScrollView style={styles.container}>
            <View style={styles.dasarRed}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={goToTax}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Create New Position</Text>
                </View>
            </View>

            <View style={styles.contentWhite}>
                <View style={styles.formGroup}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
                        <Text style={styles.buttonText}>
                            {selectedSalary ? selectedSalary.gaji_pokok : 'Pilih Salary'}
                        </Text>
                    </TouchableOpacity>
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
                                label="Masukkan Posisi"
                                onChangeText={value => handleChange('position_name', value)}
                                value={formData.position_name}
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
                                label="Descripsi (ex:Bertanggungjawab)"
                                onChangeText={value => handleChange('description', value)}
                                value={formData.description}
                            />
                        </View>
                    </View>
                </View>



                <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Create New Position</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Pilih Salary</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <FontAwesomeIcon icon={faTimesCircle} size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalContent}>
                            {salaries.map((salary) => (
                                <TouchableOpacity
                                    key={salary.id}
                                    style={[
                                        styles.positionButton,
                                        selectedSalary?.id === salary.id && styles.selectedPositionButton,
                                    ]}
                                    onPress={() => handleSalarySelect(salary)}
                                >
                                    <Text style={styles.positionButtonText}>#{salary.id} - {formatCurrency(salary.gaji_pokok)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
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
        height: 200,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 60
    },
    contentWhite: {
        backgroundColor: '#efefef',
        width: '100%',
        flex: 1,
        borderRadius: 30,
        padding: 30,
        marginTop: -90,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#ffffff',
        marginLeft: 30
    },
    formGroup: {
        marginBottom: 20,
    },
    inputContainer: {
        position: 'relative',
    },
    inputContainerStyle: {
        margin: 8,
    },
    button: {
        backgroundColor: '#6759ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
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
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContent: {
        maxHeight: '80%',
    },
    positionButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedPositionButton: {
        backgroundColor: '#EC353A',
    },
    positionButtonText: {
        fontSize: 16,
    },
});

export default DashboardBasicSalaryCreateScreen;
