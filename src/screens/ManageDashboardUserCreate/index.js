import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowCircleDown, faArrowLeft, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SweetAlert from 'react-native-sweet-alert';

const ManageDashboardUserCreate = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [positions, setPositions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    // const defaultPassword = "Djipay@123";
    const [formData, setFormData] = useState({
        employee_id: '',
        username: '',
        password: '',  // Default password
        status: 10,
    });

    useEffect(() => {
        fetchEmployees();
        fetchUsers();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees'
            );
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=user'
            );
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // const filterEmployeesWithoutLogin = () => {
    //     const userIds = users.map(user => user.id);
    //     return employees.filter(employee => !userIds.includes(employee.id));
    // };
    const filterEmployeesWithoutLogin = () => {
        const userEmployeeIds = users.map(user => user.employee_id);
        return employees.filter(employee => !userEmployeeIds.includes(employee.id));
    };

    const employeesWithoutLogin = filterEmployeesWithoutLogin();

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const generateUsername = (fullName) => {
        return fullName.replace(/\s+/g, '').toLowerCase();
    };

    const employeesButton = employeesWithoutLogin.map((employee) => (
        <TouchableOpacity
            key={employee.id}
            style={[styles.positionButton, selectedPosition === employee.id && styles.selectedPositionButton]}
            onPress={() => {
                const employee_id = `${employee.id}`;
                const fullName = `${employee.nama_depan} ${employee.nama_belakang}`;
                const username = generateUsername(fullName);
                const defaultPassword = "Djipay@123";
                setFormData({
                    employee_id: employee_id,
                    username: username,
               
                    password: defaultPassword,
                });
                setSelectedPosition(employee.id + " | "+ employee.nama_depan + " "+ employee.nama_belakang);
                setModalVisible(false); // Close modal after selecting a position
            }}
        >
            <View>
                <Text>{employee.id} | {employee.nama_depan} {employee.nama_belakang}</Text>
            </View>
        </TouchableOpacity>
    ));

    const handleSubmit = async () => {
        try {
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
    
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No token found');
            }
    
            const response = await axios.post(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/auth/register',
                {
                    username: formData.username,
         
                    password: formData.password,
                    employee_id: formData.employee_id,
                    status: 10,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
    
   
    
          
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Berhasil mebuat user login data karyawan',
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

                navigation.navigate("Employee Management");
                navigation.navigate("Manage User Login");
           
              
            
        } catch (error) {
            if (error.response && error.response.data) {
            
            } else {
                console.error('Terjadi kesalahan:', error.message);
            }
        }
    };
    
    const goToManageUserLogin = () => {
        navigation.navigate('Manage User Login');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.dasarRed}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={goToManageUserLogin}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Create User Login</Text>
                </View>
            </View>

            <View style={styles.contentWhite}>
                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setModalVisible(true)} // Buka modal ketika tombol ditekan
                        >
                            <Text style={styles.buttonText}>
                                {selectedPosition ? selectedPosition : 'Pilih Karyawan'} <FontAwesomeIcon icon={faArrowCircleDown} size={18} color="#fff" style={{ marginLeft: 100 }} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="ID"
                            value={formData.employee_id}
                            mode="outlined"
                            style={styles.input}
                            disabled
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Username"
                            value={formData.username}
                            mode="outlined"
                            style={styles.input}
                            disabled
                        />
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Password"
                            value={formData.password}
                            mode="outlined"
                            style={styles.input}
                            disabled
                        />
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
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Pilih Karyawan</Text>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <FontAwesomeIcon icon={faTimesCircle} size={24} color="#000" />
                            </Pressable>
                        </View>
                        <ScrollView>
                            <View style={styles.modalContent}>
                                {employeesWithoutLogin.length > 0 ? (
                                    employeesButton
                                ) : (
                                    <Text style={{ marginBottom:20, marginTop:20, color:'red' }}>Kosong, Buat Karyawan baru untuk user login.</Text>
                                )}
                            </View>
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
        backgroundColor: 'white',
    },
    dasarRed: {
        backgroundColor: '#6759ff',
        height: 200,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 60,
    },
    contentWhite: {
        backgroundColor: 'white',
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
        marginLeft: 30,
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContent: {
        marginBottom: 20,
    },
    positionButton: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
    },
    selectedPositionButton: {
        backgroundColor: '#585858',
    },
});

export default ManageDashboardUserCreate;
