import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput , Modal, Pressable, FlatList, ScrollView} from 'react-native';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faSave } from '@fortawesome/free-solid-svg-icons';
import { RadioButton } from 'react-native-paper';
const DetailPositionScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [userDetail, setUserDetail] = useState(null);
    const [salaries, setSalaries] = useState([]);
    const [salariesAll, setSalariesAll] = useState([]);

    const [editModePosition, setEditModePosition] = useState(false);
    const [newPositionName, setNewPositionName] = useState('');

    const [editModeSalary, setEditModeSalary] = useState(false);
    const [newSalary, setNewSalary] = useState('');

    const [salaryModalVisible, setSalaryModalVisible] = useState(false);
    
    const [selectedSalaryOption, setSelectedSalaryOption] = useState(null);
    const [selectedSalary, setSelectedSalary] = useState(null);

    const [editModeDescription, setEditModeDescription] = useState(false);
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        fetchUserDetail();
        fetchSalariesAll();
    }, []);

    useEffect(() => {
        if (userDetail) {
            setSelectedSalaryOption(userDetail.position_salary_id); 
            fetchSalaries();
        }
    }, [userDetail]);
    const fetchSalariesAll = async () => {
        try {
            const response = await axios.get(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees-salaries'
            );
            setSalariesAll(response.data);
        } catch (error) {
            console.error('Error fetching salaries:', error);
        }
    };
    const fetchUserDetail = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }

            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees/view&id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Data position:", response.data);
            setUserDetail(response.data);
            setNewPositionName(response.data.position_name); 
            setNewDescription(response.data.description); 
            setNewSalary(response.data.position_salary_id); 
        } catch (error) {
            console.error('Error fetching user login detail:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to fetch user login detail.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

    const fetchSalaries = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }

            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees-salaries/view&id=${userDetail.position_salary_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSalaries(response.data);
            console.log('salary nya :',response.data);
        } catch (error) {
            console.error('Error fetching salaries:', error);
        }
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
    const handleEditDescription = () => {
        setEditModeDescription(true); //
    };
    const handleSaveDescription = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees/update&id=${userDetail.id}`,
                { description: newDescription }, // Ganti ini dengan payload yang sesuai
                config
            );
            // Simulasikan permintaan update ke backend
            // Untuk pengujian ini, langsung update ke state userDetail
            setUserDetail((prevDetail) => ({
                ...prevDetail,
                description: newDescription,
            }));
            SweetAlert.showAlertWithOptions({
                title: 'Success',
                subTitle: 'Behasil Mengubah Deskripsi Jabatan.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'success',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
            setEditModeDescription(false); // Nonaktifkan mode edit setelah berhasil disimpan
        } catch (error) {
            console.error('Error saving Desctiption:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save Description.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };
    const handleEditPosition = () => {
        setEditModePosition(true); // Aktifkan mode edit untuk nama posisi
    };

    const handleSavePosition = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees/update&id=${userDetail.id}`,
                { position_name: newPositionName }, // Ganti ini dengan payload yang sesuai
                config
            );
            // Simulasikan permintaan update ke backend
            // Untuk pengujian ini, langsung update ke state userDetail
            setUserDetail((prevDetail) => ({
                ...prevDetail,
                position_name: newPositionName,
            }));
            SweetAlert.showAlertWithOptions({
                title: 'Success',
                subTitle: 'Behasil Mengganti Nama Posisi Jabatan.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'success',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
            setEditModePosition(false); // Nonaktifkan mode edit setelah berhasil disimpan
        } catch (error) {
            console.error('Error saving position:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save position.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

    const handleEditSalary = () => {
        // setEditModeSalary(true);
        setSalaryModalVisible(true); 

    };
    const handleSaveSalary = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');

            if (!token) {
                throw new Error('Token not found in AsyncStorage');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees/update&id=${userDetail.id}`,
                { position_salary_id: selectedSalaryOption },
                config
            );

            setUserDetail((prevDetail) => ({
                ...prevDetail,
                position_salary_id: selectedSalaryOption,
            }));
            SweetAlert.showAlertWithOptions({
                title: 'Success',
                subTitle: 'Behasil Mengubah Gaji.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'success',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
            setSalaryModalVisible(false);
        } catch (error) {
            console.error('Error saving salary:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save salary.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

    if (!userDetail) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Detail Position #{userDetail.id}</Text>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Position :</Text>
                {editModePosition ? (
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.input}
                            value={newPositionName}
                            onChangeText={setNewPositionName}
                        />
                        <TouchableOpacity onPress={handleSavePosition} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.valueContainer}>
                        <Text style={styles.value}>{userDetail.position_name}</Text>
                        <TouchableOpacity onPress={handleEditPosition} style={styles.icon}>
                            <FontAwesomeIcon icon={faPenToSquare} size={20} color="#6759ff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.label}>Salary:</Text>
                {editModeSalary ? (
                    <View style={styles.editContainer}>
                        {/* {salariesAll.map((salary) => (
                            <View key={salary.id} style={styles.radioContainer}>
                                <RadioButton
                                    style={styles.radio}
                                    value={salary.id.toString()}
                                    status={selectedSalaryOption === salary.id ? 'checked' : 'unchecked'}
                                    onPress={() => setSelectedSalaryOption(salary.id)}
                                />
                                <Text style={styles.radioText}>{formatCurrency(salary.gaji_pokok)}</Text>
                            </View>
                        ))} */}
                        <TouchableOpacity onPress={handleSaveSalary} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.valueContainer}>
                        <Text style={styles.value}>{formatCurrency(salaries.gaji_pokok)}</Text>
                        <TouchableOpacity onPress={handleEditSalary} style={styles.icon}>
                            <FontAwesomeIcon icon={faPenToSquare} size={20} color="#6759ff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.label}>Description :</Text>
                {editModeDescription ? (
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.input}
                            value={newDescription}
                            onChangeText={setNewDescription}
                            multiline
                            textAlignVertical="top"
                        />
                        <TouchableOpacity onPress={handleSaveDescription} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.valueContainer}>
                       <Text style={styles.value} numberOfLines={5} ellipsizeMode="tail">
                            {userDetail.description}
                        </Text>
                        <TouchableOpacity onPress={handleEditDescription} style={styles.icon}>
                            <FontAwesomeIcon icon={faPenToSquare} size={20} color="#6759ff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Employee Management')}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="slide"
                visible={salaryModalVisible}
                onRequestClose={() => setSalaryModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Salary</Text>
                        <ScrollView>
                            {salariesAll.map((salary) => (
                                <Pressable
                                    key={salary.id}
                                    style={[
                                        styles.radioContainer,
                                        { backgroundColor: selectedSalaryOption === salary.id ? '#e0e0e0' : '#fff' }
                                    ]}
                                    onPress={() => setSelectedSalaryOption(salary.id)}
                                >
                                    <RadioButton
                                        value={salary.id.toString()}
                                        status={selectedSalaryOption === salary.id ? 'checked' : 'unchecked'}
                                    />
                                    <Text style={styles.radioText}>{formatCurrency(salary.gaji_pokok)}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setSalaryModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveSalary} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
        padding: 20,
        paddingVertical: 60,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    detailContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#444',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
        color: '#666',
        maxWidth: '90%',
    },
    backButton: {
        backgroundColor: '#6759ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    icon: {
        marginLeft: 10,
    },

    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        maxWidth: '90%',
    },




        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          modalContent: {
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            width: '80%',
            maxHeight: '80%',

          },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        saveButton: {
            backgroundColor: '#4caf50',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        saveButtonText: {
            color: '#fff',
            fontSize: 16,
        },
        cancelButton: {
            backgroundColor: '#333',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 13,
  
           
            
       
        },
        cancelButtonText: {
            color: '#fff',
            fontSize: 16,
     
        },
        buttonContainer:{
            flexDirection:'row', justifyContent:'space-around'
        }
    
});

export default DetailPositionScreen;
