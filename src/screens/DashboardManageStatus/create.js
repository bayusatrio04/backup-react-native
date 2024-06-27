import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SweetAlert from 'react-native-sweet-alert';
import moment from 'moment';

const DashboardManageStatusCreate = ({ navigation }) => {




    const [formData, setFormData] = useState({
        status: '',
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
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=absensi-status/create',
                updatedFormData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            console.log('Server Response:', response.data);

            if (response.status) {
                
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Berhasil Menambah Data status',
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
                console.log('Data status berhasil disimpan ke database!');
                setFormData({
                    type: '',
                    description: '',
                    
                });
                navigation.navigate('Absence Management');
                navigation.navigate('Manage Status');
            } else {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Gagal menyimpan data type ke database.',
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
                console.error('Gagal menyimpan data Type ke database.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data[0].message;
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

    const goToStatus = () => {
        navigation.navigate('Manage Status');
        console.log('Status Screen');
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
                    <TouchableOpacity onPress={goToStatus}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Create New Status</Text>
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
                                label="Masukkan Status (ex: Izin)"
                                onChangeText={value => handleChange('status', value)}
                                value={formData.status}
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
                                label="Deskripsi? (ex:Informasi Bertanggungjawab sebagai)"
                                onChangeText={value => handleChange('description', value)}
                                value={formData.description}
                            />
                        </View>
                    </View>
                </View>



                <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Create New Status</Text>
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

export default DashboardManageStatusCreate;
