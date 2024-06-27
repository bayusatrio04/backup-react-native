import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUserPlus, faEye, faEdit, faTrash, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import { Tooltip } from 'react-native-paper';

const DashboardManageStatus = ({ navigation }) => {
    const [status, setStatus] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null); // Ref for search input
    const [searchMode, setSearchMode] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (!token) {
                    Alert.alert('Error', 'Token tidak ada');
                    return;
                }
                const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/statusabsence/status-absence', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (response.ok) {
                    setStatus(result.items);
                } else {
                    Alert.alert('Error', result.messages || 'Failed to fetch status absensi');
                }
            } catch (error) {
                console.error('Error fetching status absensi data:', error);
                Alert.alert('Error', 'Something went wrong while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const deleteStatus = async (status_id) => {
        try {
            // Menampilkan alert konfirmasi
            Alert.alert(
                'Konfirmasi',
                'Apakah Anda yakin menghapus data status ini?',
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

           
                            await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=absensi-status/delete&id=${status_id}`, config);

                            // Menampilkan pesan sukses
                            SweetAlert.showAlertWithOptions({
                                title: 'Sukses',
                                subTitle: 'Data Status berhasil dihapus.',
                                confirmButtonTitle: 'OK',
                                confirmButtonColor: '#32a852',
                                style: 'success',
                                cancellable: true,
                                subTitleStyle: {
                                    fontSize: 16
                                }
                            });
                            navigation.navigate('Absence Management');
                            navigation.navigate('Manage Status');
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error deleting status:', error);
            // Menampilkan pesan error
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Gagal menghapus data status.',
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
    const goToManagementAbsence = () =>{
        navigation.navigate('Absence Management');
    };

    const goToCreateStatus = () =>{
        navigation.navigate('Create New Status');
    };
    const viewDetailStatus = async(status_id) =>{
        navigation.navigate('StatusDetail', { id: status_id });
    };
    const handleSearch = () => {
        setSearchMode(true);
        Keyboard.dismiss(); // Tutup keyboard setelah pencarian
    };

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={goToManagementAbsence}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Manage Status</Text>
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
                        <Text style={styles.totalText}>Total Status: {status.length}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={goToCreateStatus}>
                        <FontAwesomeIcon icon={faUserPlus} size={25} color="#fff" />
                        <Text style={styles.addButtonText}>Add New Status</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );



    const renderStatusItem = ({ item }) => (
        <View style={styles.employeeItem}>

            <View style={styles.textContainer}>
                <Text style={styles.employeeName}>#{item.id} </Text>
                <Text style={styles.employeeName}>{item.status} </Text>
    
          
            </View>
            <View style={styles.iconContainer}>
                <Tooltip title="View Detail Karyawan" placement="bottom">
                    <TouchableOpacity onPress={() => viewDetailStatus(item.id)}>
                        <FontAwesomeIcon icon={faEye} size={20} color="#6759ff" style={styles.icon} />
                    </TouchableOpacity>
                </Tooltip>
    
                <TouchableOpacity onPress={() => deleteStatus(item.id)}>
                    <FontAwesomeIcon icon={faTrash} size={20} color="#ff3131" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const filteredStatus = status.filter(stat =>
        stat.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stat.description.toLowerCase().includes(searchQuery.toLowerCase()) 

    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                style={styles.container}
                data={searchMode ? filteredStatus : status}
                renderItem={renderStatusItem}
                keyExtractor={item => item.id.toString()}
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
    employeeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginTop:3
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 15,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
    },
    employeeName: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 5,
    },
    employeePosition: {
        fontSize: 14,
        color: '#666',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 15,
    },
});

export default DashboardManageStatus;
