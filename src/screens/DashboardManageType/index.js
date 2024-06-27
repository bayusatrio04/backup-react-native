import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUserPlus, faEye, faEdit, faTrash, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import { Tooltip } from 'react-native-paper';

const DashboardManageType = ({ navigation }) => {
    const [type, setType] = useState([]);
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
                const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/typeabsence/type-absence', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (response.ok) {
                    setType(result);
                } else {
                    Alert.alert('Error', result.messages || 'Failed to fetch type absensi');
                }
            } catch (error) {
                console.error('Error fetching type absensi data:', error);
                Alert.alert('Error', 'Something went wrong while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const deleteType = async (type_id) => {
        try {
            // Menampilkan alert konfirmasi
            Alert.alert(
                'Konfirmasi',
                'Apakah Anda yakin menghapus data type ini?',
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

           
                            await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/typeabsence/type-absence/delete?id=${type_id}`, config);

                            // Menampilkan pesan sukses
                            SweetAlert.showAlertWithOptions({
                                title: 'Sukses',
                                subTitle: 'Data Type berhasil dihapus.',
                                confirmButtonTitle: 'OK',
                                confirmButtonColor: '#32a852',
                                style: 'success',
                                cancellable: true,
                                subTitleStyle: {
                                    fontSize: 16
                                }
                            });
                            navigation.navigate('Absence Management');
                            navigation.navigate('Manage Type');
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error deleting Type:', error);
            // Menampilkan pesan error
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Gagal menghapus data Type.',
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

    const goToCreateType = () =>{
        navigation.navigate('Create New Status');
    };
    const viewDetailType = async(type_id) =>{
        navigation.navigate('TypeDetail', { id: type_id });
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
                <Text style={styles.headerText}>Manage Type</Text>
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
                        <Text style={styles.totalText}>Total Type : {type.length}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={goToCreateType}>
                        <FontAwesomeIcon icon={faUserPlus} size={25} color="#fff" />
                        <Text style={styles.addButtonText}>Add New Type</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );



    const renderTypeItem = ({ item }) => (
        <View style={styles.employeeItem}>

            <View style={styles.textContainer}>
                <Text style={styles.employeeName}>#{item.id} </Text>
                <Text style={styles.employeeName}>{item.type} </Text>
    
          
            </View>
            <View style={styles.iconContainer}>
                <Tooltip title="View Detail Type" placement="bottom">
                    <TouchableOpacity onPress={() => viewDetailType(item.id)}>
                        <FontAwesomeIcon icon={faEye} size={20} color="#6759ff" style={styles.icon} />
                    </TouchableOpacity>
                </Tooltip>
    
                <TouchableOpacity onPress={() => deleteType(item.id)}>
                    <FontAwesomeIcon icon={faTrash} size={20} color="#ff3131" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const filteredType = type.filter(typ =>
        typ.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        typ.description.toLowerCase().includes(searchQuery.toLowerCase()) 

    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                style={styles.container}
                data={searchMode ? filteredType : type}
                renderItem={renderTypeItem}
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

export default DashboardManageType;
