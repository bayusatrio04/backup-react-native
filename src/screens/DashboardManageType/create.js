import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SweetAlert from 'react-native-sweet-alert';
import moment from 'moment';

const DashboardManageTypeCreate = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);


   

    const [formData, setFormData] = useState({
        type: '',
        description: '',
        created_at: '',
        updated_at: '',

    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        });
    };

    const handleSubmit = async () => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedFormData = {
            ...formData,
            created_at: currentDateTime,
            updated_at: updatedDateTime,
        };
        for (const key in updatedFormData) {
            if (!updatedFormData[key]) {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Mohon lengkapi semua bidang formulir.',
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#c71515',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'error',
                    cancellable: true,
                    subTitleStyle: {
                      fontSize: 40
                    }
                  });
                return;
            }
        }

        console.log(updatedFormData);
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No token found');
        }

        try {
            const response = await axios.post(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=absensi-type/create',
                updatedFormData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            console.log('Server Response:', response.data);

        
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Berhasil Menambah Data Type',
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#c71515',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'success',
                    cancellable: true,
                    subTitleStyle: {
                      fontSize: 40
                    }
                  });
                console.log('Data Type berhasil disimpan ke database!');
    
                navigation.navigate('Absence Management');
                navigation.navigate('Manage Type');
           
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: errorMessage,
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#c71515',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'error',
                    cancellable: true,
                    subTitleStyle: {
                      fontSize: 40
                    }
                  });
            } else {
                console.error('Terjadi kesalahan:', error.message);
            }
        }
    };

    const goToAbsenceManagement = () => {
        navigation.navigate('Absence Management');
        console.log('Absence Management Screen');
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
    return (
        <ScrollView style={styles.container}>
            <View style={styles.dasarRed}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={goToAbsenceManagement}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Create New Type</Text>
                </View>
            </View>

            <View style={styles.contentWhite}>
                
                <View style={[styles.formGroup, { flex: 0.5 }]}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainerStyle}>
                            <TextInput
                                style={{ borderColor: 'red' }}
                                mode="outlined"
                                activeUnderlineColor="transparent"
                                theme={{
                                    roundness: 20,
                                }}
                                label="Masukkan type (ex: Izin-Sebentar)"
                                onChangeText={value => handleChange('type', value)}
                                value={formData.type}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainerStyle}>
                            <TextInput
                                style={{ borderColor: 'red' }}
                                mode="outlined"
                                activeUnderlineColor="transparent"
                                theme={{
                                    roundness: 20,
                                }}
                                label="Deskripsi? (ex:Beristirahat sebentar)"
                                onChangeText={value => handleChange('description', value)}
                                value={formData.description}
                            />
                        </View>
                    </View>
                </View>



                <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Create New Type</Text>
                </TouchableOpacity>
            </View>

          
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    dasarRed: {
        backgroundColor: '#6759ff',
        height: 200,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 60
    },
    contentWhite: {
        backgroundColor: '#f8f8f8',
        width: '100%',
        flex: 1,
        borderRadius: 30,
        padding: 30,
        marginTop: -90,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#ffffff',
        marginLeft: 30
    },
    formGroup: {
        marginBottom: 20,
    },
    inputContainer: {
        position: 'relative',
    },
    inputContainerStyle: {
        margin: 8,
    },
    button: {
        backgroundColor: '#6759ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },

});

export default DashboardManageTypeCreate;
