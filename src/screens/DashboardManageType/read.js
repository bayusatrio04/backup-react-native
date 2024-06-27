import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faSave } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-native-paper';
const TypeDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const [status, setType] = useState(null);
    const [editModeType, setEditModeType] = useState(false);
    const [newType, setNewType] = useState('');
    const [editModeDesc, setEditModeDesc] = useState(false);
    const [newDesc, setNewDesc] = useState('');
    

    const fetchstatus = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }
            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/typeabsence/type-absence/view?id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
               
            );
            console.log('Berhasil Get data :', id);
            console.log("data type:", response.data);
            // console.log("data username:", status.data.username);
            setType(response);
            setNewType(response.data.type);
            setNewDesc(response.data.description);
         
        } catch (error) {
            console.error('Error fetching Type detail:', error);
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




  

    const handleEditType = () => {
        setEditModeType(true); // Aktifkan mode edit untuk nama posisi
    };

    const handleSaveType = async () => {
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
            console.log('Type id:', status.data.id);
            const payload = {
                type: newType // Pastikan payload hanya berisi username yang baru
            };
    
            console.log('type id:', status.data.id);
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/typeabsence/type-absence/update?id=${status.data.id}`,
                payload,
                config
            );

            if(response.status){
                console.log('Berhasil Update Type');
            }
 
            setType((prevDetail) => ({
                ...prevDetail,
                data: { ...prevDetail.data, type: newType } // Perbaiki update username di sini
            }));

            setEditModeType(false); 
        } catch (error) {
            console.error('Error saving type:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save type.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };
    const handleEditDesc = () => {
        setEditModeDesc(true); // Aktifkan mode edit untuk nama posisi
    };

    const handleSaveDesc = async () => {
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
            console.log('desc id:', status.data.id);
            const payload = {
                description: newDesc // Pastikan payload hanya berisi username yang baru
            };
    
            console.log('status id:', status.data.id);
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/typeabsence/type-absence/update?id=${status.data.id}`,
                payload,
                config
            );

            if(response.status){
                console.log('Berhasil Update description');
            }
            // Simulasikan permintaan update ke backend
            // Untuk pengujian ini, langsung update ke state status
            setType((prevDetail) => ({
                ...prevDetail,
                data: { ...prevDetail.data, description: newDesc } // Perbaiki update username di sini
            }));

            setEditModeDesc(false); 
        } catch (error) {
            console.error('Error saving description:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save description.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

    useEffect(() => {
        fetchstatus();
    }, []);

    if (!status) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Status Detail #{status.data.id}</Text>
            <View style={styles.detailContainer}>
            <Text style={styles.label}>Status:</Text>
                {editModeType ?(
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.input}
                            value={newType}
                            onChangeText={setNewType}
  
                        />
                        <TouchableOpacity onPress={handleSaveType} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>

                ):(
                    <View style={styles.valueContainer}>

                        <Text style={styles.value}>{status.data.type}</Text>
                        <TouchableOpacity onPress={handleEditType} style={styles.icon}>
                            <FontAwesomeIcon icon={faPenToSquare} size={20} color="#6759ff" />
                        </TouchableOpacity>
                    </View>

                )}

            </View>

            <View style={styles.detailContainer}>
            <Text style={styles.label}>Description:</Text>
                {editModeDesc ?(
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.input}
                            value={newDesc}
                            onChangeText={setNewDesc}
                            multiline
  
                        />
                        <TouchableOpacity onPress={handleSaveDesc} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>

                ):(
                    <View style={styles.valueContainer}>

                        <Text style={styles.value}>{status.data.description}</Text>
                        <TouchableOpacity onPress={handleEditDesc} style={styles.icon}>
                            <FontAwesomeIcon icon={faPenToSquare} size={20} color="#6759ff" />
                        </TouchableOpacity>
                    </View>

                )}

            </View>
      

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Absence Management')}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
        padding: 20,
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
    resetButton: {
        backgroundColor: '#ff4d4d',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    downloadButton: {
        backgroundColor: '#4caf50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
    
});

export default TypeDetail;
