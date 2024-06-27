import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUserPlus, faEye, faTrash, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import { Tooltip } from 'react-native-paper';

const DashboardBasicSalary = ({ navigation }) => {
    const [basicSalary, setBasicSalary] = useState([]);
    const searchInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState(false);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }

            const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees-salaries', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const responseText = await response.text();
            try {
                const result = JSON.parse(responseText);
                if (response.status) {
                    setBasicSalary(result); // mengambil 15 data pertama
                    console.log('Data Basic Salary : ', result);
                } else {
                    console.error('Error fetching Basic Salary details:', result);
                    Alert.alert('Error', 'Failed to fetch Basic Salary details.');
                }
            } catch (e) {
                console.error('Error parsing response as JSON:', e);
                console.error('Response text:', responseText);
                Alert.alert('Error', 'Failed to parse server response.');
            }

        } catch (error) {
            console.error('Error fetching basic Salary details:', error);
            Alert.alert('Error', 'Failed to fetch basic Salary details.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const goToCreateBasicSalary = () => {
        navigation.navigate('Create New Basic Salary');
    };

    const goToPayrollManagement = () => {
        navigation.navigate('Payroll Management');
    };

    const detailBasicSalary = (id) => {
        navigation.navigate('Detail Basic Salary', { id: id });
    };

    const deleteData = async (id) => {
        try {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to delete this Basic Salary?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes', onPress: async () => {
                        const token = await AsyncStorage.getItem('accessToken');
                        if (!token) {
                            throw new Error('Token not found in AsyncStorage');
                        }

                        const config = {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        };

                        await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees-salaries/delete&id=${id}`, config);

                        SweetAlert.showAlertWithOptions({
                            title: 'Success',
                            subTitle: 'Data Gaji Pokok Berhasil dihapus.',
                            confirmButtonTitle: 'OK',
                            confirmButtonColor: '#32a852',
                            style: 'success',
                            cancellable: true,
                            subTitleStyle: {
                                fontSize: 16
                            }
                        });

                        navigation.navigate('Payroll Management');
                        navigation.navigate('Manage Basic Salary');
                    }}
                ]
            );
        } catch (error) {
            console.error('Error deleting Tax:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to delete Tax.',
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
        Keyboard.dismiss();
    };

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={goToPayrollManagement}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Basic Salary</Text>
                {searchMode ? (
                    <>
                        <TextInput
                            ref={searchInputRef}
                            style={styles.searchInput}
                            placeholder="Search Gaji Pokok..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            autoFocus={false}
                        />
                        <TouchableOpacity onPress={() => setSearchMode(false)}>
                            <FontAwesomeIcon icon={faTimes} size={25} color="#fff" />
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
                        <Text style={styles.totalText}>Total Data: {basicSalary.length}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={goToCreateBasicSalary}>
                        <FontAwesomeIcon icon={faUserPlus} size={25} color="#fff" />
                        <Text style={styles.addButtonText}>Add New Basic Salary</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const rendeBasicSalary = ({ item }) => (
        <View style={styles.employeeItem}>
            <View style={styles.textContainer}>
                <Text style={styles.employeeName}>ID: #{item.id}</Text>
                <Text style={styles.employeePosition}>Gaji Pokok: {item.gaji_pokok}</Text>
            </View>
            <View style={styles.iconContainer}>
                <Tooltip title="View Detail Position" placement="bottom">
                    <TouchableOpacity onPress={() => detailBasicSalary(item.id)}>
                        <FontAwesomeIcon icon={faEye} size={20} color="#6759ff" style={styles.icon} />
                    </TouchableOpacity>
                </Tooltip>
                <TouchableOpacity onPress={() => deleteData(item.id)}>
                    <FontAwesomeIcon icon={faTrash} size={20} color="#ff3131" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={basicSalary.filter(pos => pos.gaji_pokok.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={rendeBasicSalary}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={renderHeader}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#EC353A',
        height: 150,
        paddingHorizontal: 20,
     
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        paddingHorizontal: 10,
      
        flex: 1,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginLeft: 10,
        height: 40,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
        marginTop: -10,
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
        padding: 10,
        borderRadius: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EC353A',
        padding: 10,
        borderRadius: 10,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    employeeItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
    },
    employeeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    employeePosition: {
        fontSize: 14,
        color: '#666',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 15,
    },
});

export default DashboardBasicSalary;
