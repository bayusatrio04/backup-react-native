import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput , Modal, Pressable, FlatList, ScrollView} from 'react-native';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faSave } from '@fortawesome/free-solid-svg-icons';
import { RadioButton } from 'react-native-paper';
const DetailTaxScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [taxDetail, setTaxDetail] = useState(null);



    const [editModePercentage, setEditModePercentage] = useState(false);
    const [newPercentage, setNewPercentage] = useState('');

    const [editModeMasaBerlaku, setEditModeMasaBerlaku] = useState(false);
    const [newMasaBerlaku, setNewMasaBerlaku] = useState('');

    


    useEffect(() => {
        fetchTaxDetail();
   
    }, []);


    const fetchTaxDetail = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }

            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/salary/manage-tax/view?id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200){


                console.log("Data position:", response.data);
                setTaxDetail(response.data);
                setNewPercentage(response.data.percentage); 
          
                setNewMasaBerlaku(response.data.masa_berlaku); 
    
                }


        } catch (error) {
            console.error('Error fetching Tax detail:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to fetch Tax detail.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };


    const handleEditMasaBerlaku = () => {
        setEditModeMasaBerlaku(true); 
    };
    const handleSaveMasaBerlaku = async () => {
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
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/salary/manage-tax/update?id=${taxDetail.id}`,
                { masa_berlaku: newMasaBerlaku }, // Ganti ini dengan payload yang sesuai
                config
            );
            // Simulasikan permintaan update ke backend
            // Untuk pengujian ini, langsung update ke state userDetail
            setTaxDetail((prevDetail) => ({
                ...prevDetail,
                masa_berlaku: newMasaBerlaku,
            }));
            SweetAlert.showAlertWithOptions({
                title: 'Success',
                subTitle: 'Berhasil mengubah data .',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'Success',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
            setEditModeMasaBerlaku(false); // Nonaktifkan mode edit setelah berhasil disimpan
        } catch (error) {
            console.error('Error saving Masa Berlaku:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save Masa Berlaku.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };
    const handleEditPercentage = () => {
        setEditModePercentage(true); // Aktifkan mode edit untuk nama posisi
    };

    const handleSavePercentage = async () => {
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
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/salary/manage-tax/update?id=${taxDetail.id}`,
                { percentage: newPercentage }, // Ganti ini dengan payload yang sesuai
                config
            );
            // Simulasikan permintaan update ke backend
            // Untuk pengujian ini, langsung update ke state userDetail
            setTaxDetail((prevDetail) => ({
                ...prevDetail,
                percentage: newPercentage,
            }));
            SweetAlert.showAlertWithOptions({
                title: 'Success',
                subTitle: 'Berhasil mengubah data .',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'Success',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
            setEditModePercentage(false); // Nonaktifkan mode edit setelah berhasil disimpan
        } catch (error) {
            console.error('Error saving Percentage:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save Percentage.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

  

    if (!taxDetail) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Detail Tax #{taxDetail.id}</Text>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Percentage :</Text>
                {editModePercentage ? (
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.input}
                            value={newPercentage}
                            onChangeText={setNewPercentage}
                        />
                        <TouchableOpacity onPress={handleSavePercentage} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.valueContainer}>
                        <Text style={styles.value}>{taxDetail.percentage}</Text>
                        <TouchableOpacity onPress={handleEditPercentage} style={styles.icon}>
                            <FontAwesomeIcon icon={faPenToSquare} size={20} color="#6759ff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

           
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Masa Berlaku :</Text>
                {editModeMasaBerlaku ? (
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.input}
                            value={newMasaBerlaku}
                            onChangeText={setNewMasaBerlaku}
                            multiline
                            textAlignVertical="top"
                        />
                        <TouchableOpacity onPress={handleSaveMasaBerlaku} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.valueContainer}>
                       <Text style={styles.value} numberOfLines={5} ellipsizeMode="tail">
                            {taxDetail.masa_berlaku}
                        </Text>
                        <TouchableOpacity onPress={handleEditMasaBerlaku} style={styles.icon}>
                            <FontAwesomeIcon icon={faPenToSquare} size={20} color="#6759ff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Payroll Management')}>
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
        backgroundColor: '#900',
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

export default DetailTaxScreen;
