import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUserPlus, faEye, faEdit, faTrash, faSearch, faTimes, faFileInvoiceDollar, faIdBadge, faBriefcase, faClock, faDollarSign, faUtensils, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import { Tooltip } from 'react-native-paper';

const DashboardPayrolls = ({ navigation }) => {
    const [salary, setSalary] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null); // Ref for search input
    const [searchMode, setSearchMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }
    
            const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/salary/salary-calculate-employees/month', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const responseText = await response.text();
            try {
                const result = JSON.parse(responseText);
                if (result.Status == "200") {
                    setSalary(result.data);
                    console.log('Data salary : ', result);
                } else {
                    console.error('Error fetching salary details:', result);
                    Alert.alert('Error', 'Failed to fetch salary details.');
                }
            } catch (e) {
                console.error('Error parsing response as JSON:', e);
                console.error('Response text:', responseText);
                Alert.alert('Error', 'Failed to parse server response.');
            }
    
        } catch (error) {
            console.error('Error fetching salary details:', error);
            Alert.alert('Error', 'Failed to fetch salary details.');
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    const goToEmployeeCreate = () => {
        navigation.navigate('Create Employee');
    };

    const goToPayrollManagement = () => {
        navigation.navigate('Payroll Management');
    };

    const viewEmployeeDetail = (employeeId) => {
        navigation.navigate('Employee Detail', { id: employeeId });
    };

    const updateEmployee = (employeeId) => {
        navigation.navigate('Update Employee', { id: employeeId });
    };

    const deleteEmployee = async (employeeId) => {
        try {
            // Menampilkan alert konfirmasi
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

                            // Menghapus pengguna terlebih dahulu
                            const response = await axios.get(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=user`);
                            const users = response.data;
                            const userToDelete = users.find(user => user.employee_id === employeeId);

                            if (userToDelete) {
                                await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=user/delete&id=${userToDelete.id}`, config);
                            }

                            // Menghapus karyawan
                            await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees/delete&id=${employeeId}`, config);

                            // Menampilkan pesan sukses
                            SweetAlert.showAlertWithOptions({
                                title: 'Sukses',
                                subTitle: 'Karyawan berhasil dihapus.',
                                confirmButtonTitle: 'OK',
                                confirmButtonColor: '#32a852',
                                style: 'success',
                                cancellable: true,
                                subTitleStyle: {
                                    fontSize: 16
                                }
                            });
                            navigation.navigate('Employee Management');
                            navigation.navigate('Employees');
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error deleting employee:', error);
            // Menampilkan pesan error
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Gagal menghapus karyawan.',
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
        Keyboard.dismiss(); // Tutup keyboard setelah pencarian
    };

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={goToPayrollManagement}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Payrolls</Text>
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
                    <TouchableOpacity style={styles.addButton} onPress={goToEmployeeCreate}>
                        <FontAwesomeIcon icon={faFileInvoiceDollar} size={25} color="#fff" />
                        <Text style={styles.addButtonText}>Generated Salary</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderSalaryItem = ({ item }) => (
        <View style={styles.salaryItem}>
            <View style={styles.salaryItemRow}>
                <FontAwesomeIcon icon={faIdBadge} size={20} color="#EC353A" />
                <Text style={styles.salaryText}>ID Karyawan: {item['ID Karyawan']}</Text>
            </View>
            <View style={styles.salaryItemRow}>
                <FontAwesomeIcon icon={faBriefcase} size={20} color="#EC353A" />
                <Text style={styles.salaryText}>Jabatan Karyawan: {item['Jabatan Karyawan']}</Text>
            </View>
            <View style={styles.salaryItemRow}>
                <FontAwesomeIcon icon={faClock} size={20} color="#EC353A" />
                <Text style={styles.salaryText}>Total Hadir: {item['Total Hadir']}</Text>
            </View>
            <View style={styles.salaryItemRow}>
                <FontAwesomeIcon icon={faDollarSign} size={20} color="#EC353A" />
                <Text style={styles.salaryText}>Gaji Pokok: {item['Gaji Pokok']}</Text>
            </View>
            <View style={styles.salaryItemRow}>
                <FontAwesomeIcon icon={faUtensils} size={20} color="#EC353A" />
                <Text style={styles.salaryText}>Total Tunjangan Makan: {item['Total Tunjangan Makan']}</Text>
            </View>
            <View style={styles.salaryItemRow}>
                <FontAwesomeIcon icon={faMoneyBillWave} size={20} color="#EC353A" />
                <Text style={styles.salaryText}>Earnings: {item['Earnings']}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                style={styles.container}
                data={salary}
                renderItem={renderSalaryItem}
                keyExtractor={item => item['ID Karyawan'].toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#EC353A',
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
        backgroundColor: '#EC353A',
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
        borderColor: '#EC353A',
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
        backgroundColor: '#EC353A',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },
    salaryItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginTop: 3,
    },
    salaryItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    salaryText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
    }
});

export default DashboardPayrolls;
