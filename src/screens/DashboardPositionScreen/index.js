import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUserPlus, faEye, faTrash, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';


const DashboardPositionScreen = ({ navigation }) => {
    const [positions, setPositions] = useState([]);
    const searchInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees');
                setPositions(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const goToCreatePositionJob = () => {
        navigation.navigate('Create Position Job');
    };

    const goToEmployeeManagement = () => {
        navigation.navigate('Employee Management');
    };

    const detailPosition = (position_id) => {
        navigation.navigate('Detail Position Job', { id: position_id });
    };

    const deletePosition = async (positionId) => {
        try {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to delete this position?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes', onPress: async () => {
                        const token = await AsyncStorage.getItem('accessToken');
                        if (!token) {
                            SweetAlert.showAlertWithOptions({
                                title: 'Error',
                                subTitle: 'Token not found.',
                                confirmButtonTitle: 'OK',
                                confirmButtonColor: '#c71515',
                                style: 'error',
                                cancellable: true,
                                subTitleStyle: {
                                    fontSize: 16
                                }
                            });
                            return;
                        }

                        const config = {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        };

                        await axios.delete(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees/delete&id=${positionId}`, config);

                        SweetAlert.showAlertWithOptions({
                            title: 'Success',
                            subTitle: 'Position deleted successfully.',
                            confirmButtonTitle: 'OK',
                            confirmButtonColor: '#32a852',
                            style: 'success',
                            cancellable: true,
                            subTitleStyle: {
                                fontSize: 16
                            }
                        });

                        // Menghapus posisi dari state
                        setPositions(positions.filter(position => position.id !== positionId));
                    }}
                ]
            );
        } catch (error) {
            console.error('Error deleting position:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to delete position.',
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
                <TouchableOpacity onPress={goToEmployeeManagement}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Position Job</Text>
                {searchMode ? (
                    <>
                        <TextInput
                            ref={searchInputRef}
                            style={styles.searchInput}
                            placeholder="Search..."
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
                        <Text style={styles.totalText}>Total Position: {positions.length}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={goToCreatePositionJob}>
                        <FontAwesomeIcon icon={faUserPlus} size={25} color="#fff" />
                        <Text style={styles.addButtonText}>Add New Position</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderPositionsData = ({ item }) => (
        <View style={styles.positionItem}>
            <View style={styles.textContainer}>
                <Text style={styles.positionName}>ID: #{item.id}</Text>
                <Text style={styles.positionJob}>Job: {item.position_name}</Text>
            </View>
            <View style={styles.iconContainer}>
       
                    <TouchableOpacity onPress={() => detailPosition(item.id)}>
                        <FontAwesomeIcon icon={faEye} size={20} color="#6759ff" style={styles.icon} />
                    </TouchableOpacity>


                <TouchableOpacity onPress={() => deletePosition(item.id)}>
                    <FontAwesomeIcon icon={faTrash} size={20} color="#ff3131" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                data={positions.filter(pos => pos.position_name.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={renderPositionsData}
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
    positionItem: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    positionName: {
        fontSize: 16,
        fontWeight: '600',
    },
    positionJob: {
        fontSize: 14,
        color: '#666',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
    },
});

export default DashboardPositionScreen;
