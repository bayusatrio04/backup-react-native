import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUserPlus, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import { Tooltip } from 'react-native-paper';

const ManageDashboardUser = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, employeeResponse] = await Promise.all([
                    axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=user'),
                    axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees')
                ]);

                const usersData = userResponse.data;
                const employeesData = employeeResponse.data;

                const filteredUsersData = usersData.filter(user => {
                    const employee = employeesData.find(emp => emp.id === user.employee_id);
                    return employee && employee.position_id !== 12;
                });

                setUsers(filteredUsersData);
                setEmployees(employeesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const goToCreateUserLogin = () => {
        navigation.navigate('Create User Login');
    };

    const goToEmployeeManagement = () => {
        navigation.navigate('Employee Management');
    };

    const viewUserDetail = (employeeId) => {
        console.log('ID User : ', employeeId )
        navigation.navigate('Detail User Login', { id: employeeId });

    };

    const updateUser = (employeeId) => {
        navigation.navigate('Update Employee', { id: employeeId });
   
    };

    const deleteUser = async (employeeId) => {
        try {
            Alert.alert(
                'Konfirmasi',
                'Apakah Anda yakin menghapus data karyawan ini?',
                [
                    { text: 'Batal', style: 'cancel' },
                    {
                        text: 'Ya', onPress: async () => {
                            const token = await AsyncStorage.getItem('accessToken');
                            if (!token) {
                                throw new Error('Token tidak ditemukan di AsyncStorage');
                            }
    
                            const config = {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            };
                            console.log(employeeId);
    
                            // Delete user login data
                            await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/users/delete?id=${employeeId}`, config);
    
                            // Delete employee data if needed
                            // await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php?r=employees/delete&id=${employeeId}`, config);
    
                            SweetAlert.showAlertWithOptions({
                                title: 'Sukses',
                                subTitle: 'Data user berhasil dihapus.',
                                confirmButtonTitle: 'OK',
                                confirmButtonColor: '#32a852',
                                style: 'success',
                                cancellable: true,
                                subTitleStyle: {
                                    fontSize: 16
                                }
                            });
                            navigation.navigate('Employee Management');
                            navigation.navigate('Manage User Login');
                       
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error deleting user:', error.response ? error.response.data : error.message);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Gagal menghapus data user.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: {
                    fontSize: 16
                }
            });
        }
    };
    

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={goToEmployeeManagement}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>User Login</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.topSection}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total User: {users.length}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={goToCreateUserLogin}>
                        <FontAwesomeIcon icon={faUserPlus} size={25} color="#fff" />
                        <Text style={styles.addButtonText}>Add User Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const images = [
        require('../../assets/images/avatar/avatar-1.jpg'),
        require('../../assets/images/avatar/avatar-2.jpg'),
        require('../../assets/images/avatar/avatar-3.jpg'),
        require('../../assets/images/avatar/avatar-4.jpg'),
        require('../../assets/images/avatar/avatar-5.jpg'),
        require('../../assets/images/avatar/avatar-6.jpg'),
        require('../../assets/images/avatar/img-avatar-1.jpg'),
        require('../../assets/images/avatar/img-avatar-2.jpg'),
        require('../../assets/images/avatar/img-avatar-3.jpg'),
    ];

    const getRandomImage = () => {
        return images[Math.floor(Math.random() * images.length)];
    };

    const renderEmployeeItem = ({ item }) => (
        <View style={styles.employeeItem}>
            <View style={styles.profileButton}>
                <Image source={getRandomImage()} style={styles.profileImage} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.employeeName}>{item.username}</Text>
                <Text style={styles.employeePosition}>{item.email}</Text>
            </View>
            <View style={styles.iconContainer}>
                <Tooltip title="View Detail Karyawan" placement="bottom">
                    <TouchableOpacity onPress={() => viewUserDetail(item.id)}>
                        <FontAwesomeIcon icon={faEye} size={20} color="#67cfff" style={styles.icon} />
                    </TouchableOpacity>
                </Tooltip>
                <TouchableOpacity onPress={() => updateUser(item.id)}>
                    <FontAwesomeIcon icon={faEdit} size={20} color="#c2fa2a" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteUser(item.id)}>
                    <FontAwesomeIcon icon={faTrash} size={20} color="#ff39d1" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            style={styles.container}
            data={users}
            renderItem={renderEmployeeItem}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={renderHeader}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#6759ff',
        height: 150,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '500',
        color: '#ffffff',
        marginLeft: 30,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,
        paddingHorizontal: 20,
        marginTop: -30,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalContainer: {
        backgroundColor: '#33333300',
        borderWidth: 1,
        borderColor: '#6759ff',
        padding: 20,
        borderRadius: 25,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6759ff',
        padding: 20,
        borderRadius: 25,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
    employeeItem: {
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#6759ff',
        padding: 20,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 10,
        top: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        left: 10
    },
    employeeName: {
        fontSize: 16,
        fontWeight: '600',
    },
    employeePosition: {
        fontSize: 14,
        color: '#666',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});

export default ManageDashboardUser;
