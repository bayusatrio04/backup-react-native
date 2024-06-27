import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUserPlus, faEye, faTrash, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import { Tooltip } from 'react-native-paper';

const DashboardTaxScreen = ({ navigation }) => {
    const [tax, setTax] = useState([]);
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

            const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/salary/manage-tax', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const responseText = await response.text();
            try {
                const result = JSON.parse(responseText);
                if (response.status) {
                    setTax(result.items.slice(0, 15)); // mengambil 15 data pertama
                    console.log('Data Tax : ', result);
                } else {
                    console.error('Error fetching Tax details:', result);
                    Alert.alert('Error', 'Failed to fetch Tax details.');
                }
            } catch (e) {
                console.error('Error parsing response as JSON:', e);
                console.error('Response text:', responseText);
                Alert.alert('Error', 'Failed to parse server response.');
            }

        } catch (error) {
            console.error('Error fetching Tax details:', error);
            Alert.alert('Error', 'Failed to fetch Tax details.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const goToCreateTax = () => {
        navigation.navigate('Create New Tax');
    };

    const goToPayrollManagement = () => {
        navigation.navigate('Payroll Management');
    };

    const detailTax = (tax_id) => {
        navigation.navigate('Detail Tax', { id: tax_id });
    };

    const deleteTax = async (taxId) => {
        try {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to delete this Tax?',
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

                        await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/salary/manage-tax/delete?id=${taxId}`, config);

                        SweetAlert.showAlertWithOptions({
                            title: 'Success',
                            subTitle: 'Tax deleted successfully.',
                            confirmButtonTitle: 'OK',
                            confirmButtonColor: '#32a852',
                            style: 'success',
                            cancellable: true,
                            subTitleStyle: {
                                fontSize: 16
                            }
                        });

                        navigation.navigate('Payroll Management');
                        navigation.navigate('Tax');
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
                <Text style={styles.headerText}>Tax</Text>
                {searchMode ? (
                    <>
                        <TextInput
                            ref={searchInputRef}
                            style={styles.searchInput}
                            placeholder="Search Percentage Tax..."
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
                        <Text style={styles.totalText}>Total Tax: {tax.length}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={goToCreateTax}>
                        <FontAwesomeIcon icon={faUserPlus} size={25} color="#fff" />
                        <Text style={styles.addButtonText}>Add New Tax</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderTax = ({ item }) => (
        <View style={styles.employeeItem}>
            <View style={styles.textContainer}>
                <Text style={styles.employeeName}>ID: #{item.id}</Text>
                <Text style={styles.employeePosition}>Percentage Tax: {item.percentage}</Text>
            </View>
            <View style={styles.iconContainer}>
                <Tooltip title="View Detail Position" placement="bottom">
                    <TouchableOpacity onPress={() => detailTax(item.id)}>
                        <FontAwesomeIcon icon={faEye} size={20} color="#6759ff" style={styles.icon} />
                    </TouchableOpacity>
                </Tooltip>
                <TouchableOpacity onPress={() => deleteTax(item.id)}>
                    <FontAwesomeIcon icon={faTrash} size={20} color="#ff3131" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tax.filter(pos => pos.percentage.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={renderTax}
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

export default DashboardTaxScreen;
