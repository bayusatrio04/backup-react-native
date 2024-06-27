import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUserPlus, faEye, faEdit, faTrash, faSearch, faClose, faTimes } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import { Tooltip } from 'react-native-paper';

const ManageDashboardUser = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [positions, setPositions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null); // Ref for search input
    const [searchMode, setSearchMode] = useState(false);
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
                    return employee && employee.position_id !== 6;
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

                            // Delete user login data
                            await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/users/delete?id=${employeeId}`, config);

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

    const handleSearch = () => {
        setSearchMode(true);
        Keyboard.dismiss(); // Dismiss keyboard after search
    };

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={goToEmployeeManagement}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>User Login</Text>
                {searchMode ? (
                    <>
                    <TextInput
                        ref={searchInputRef}
                        style={styles.searchInput}
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        autoFocus={false} // No autofocus initially
                    />
                    <TouchableOpacity onPress={() => setSearchMode(false)}>
                    <FontAwesomeIcon icon={faTimes} size={25} color="#333" />
                    </TouchableOpacity>
                    </>

                ) : (
                    <TouchableOpacity onPress={handleSearch}>
                       <FontAwesomeIcon icon={faSearch} size={25} color="#fff" />
                    </TouchableOpacity>
                )}
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

                {item.status === 9 ? (
                    <Text style={[styles.employeePosition, { backgroundColor: 'red', alignSelf: 'flex-start', color: 'white', padding: 2, borderRadius: 5, fontSize: 10 }]}>Deactive</Text>
                ) : (
                    <Text style={[styles.employeePosition, { backgroundColor: 'green', alignSelf: 'flex-start', color: 'white', width:'20%', textAlign:'center',  borderRadius: 5, fontSize: 10, fontWeight:'bold' }]}>Active</Text>
                )}
            </View>
            <View style={styles.iconContainer}>
                <Tooltip title="View Detail Karyawan" placement="bottom">
                    <TouchableOpacity onPress={() => viewUserDetail(item.id)}>
                        <FontAwesomeIcon icon={faEye} size={20} color="#6759ff" style={styles.icon} />
                    </TouchableOpacity>
                </Tooltip>

                <TouchableOpacity onPress={() => deleteUser(item.id)}>
                    <FontAwesomeIcon icon={faTrash} size={20} color="#ff39d1" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
    const renderEmptySearch = () => (
        <View style={styles.emptySearchContainer}>
            <Text style={styles.emptySearchText}>Data search not found.</Text>
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#efefef',
        },
        header: {
            flexDirection: 'row',
            backgroundColor: '#6759ff',
            height: 150,
            paddingHorizontal: 30,
            paddingVertical: 60,
            alignItems: 'center',
        },
        headerText: {
            fontSize: 24,
            fontWeight: '500',
            color: '#ffffff',
            marginLeft: 30,
            flex: 1,
        },
        searchInput: {
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginLeft: 10,
        },
        searchButton: {
            backgroundColor: '#6759ff',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginLeft: 10,
        },
        searchButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
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

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                style={styles.container}
                data={users.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={renderEmployeeItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

export default ManageDashboardUser;
