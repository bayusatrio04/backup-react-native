import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput , Modal, Pressable, FlatList, ScrollView} from 'react-native';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faSave } from '@fortawesome/free-solid-svg-icons';
import { RadioButton } from 'react-native-paper';
const DetailBasicSalaryScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [basicSalary, setBasicSalary] = useState(null);

    const [salaries, setSalaries] = useState([]);
    const [salariesAll, setSalariesAll] = useState([]);

    const [editModePercentage, setEditModeGajiPokok] = useState(false);
    const [newGajiPokok, setNewGajiPokok] = useState('');

    const [editModeMasaBerlaku, setEditModeMasaBerlaku] = useState(false);
    const [newMasaBerlaku, setNewMasaBerlaku] = useState('');

    
    const [selectedSalaryOption, setSelectedSalaryOption] = useState(null);
    const [selectedSalary, setSelectedSalary] = useState(null);

    const [editModeDescription, setEditModeDescription] = useState(false);
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        fetchBasicSalary();
   
    }, []);


    const fetchBasicSalary = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }

            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees-salaries/view&id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Data position:", response.data);
            setBasicSalary(response.data);
            setNewGajiPokok(response.data.gaji_pokok); 

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


    const handleEditGajiPokok = () => {
        setEditModeGajiPokok(true); // Aktifkan mode edit untuk nama posisi
    };

    const handeSaveGajiPokok = async () => {
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
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees-salaries/update&id=${basicSalary.id}`,
                { gaji_pokok: newGajiPokok }, // Ganti ini dengan payload yang sesuai
                config
            );
            // Simulasikan permintaan update ke backend
            // Untuk pengujian ini, langsung update ke state userDetail
            setBasicSalary((prevDetail) => ({
                ...prevDetail,
                gaji_pokok: newGajiPokok,
            }));
            SweetAlert.showAlertWithOptions({
                title: 'Success',
                subTitle: 'Berhasil mengubah data.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'success',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
            setEditModeGajiPokok(false); // Nonaktifkan mode edit setelah berhasil disimpan
        } catch (error) {
            console.error('Error saving Gaji Pokok:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save .',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
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

    if (!basicSalary) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Detail Gaji Pokok #{basicSalary.id}</Text>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Gaji Pokok :</Text>
                {editModePercentage ? (
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.input}
                            value={newGajiPokok}
                            onChangeText={setNewGajiPokok}
                        />
                        <TouchableOpacity onPress={handeSaveGajiPokok} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.valueContainer}>
                        <Text style={styles.value}>{formatCurrency(basicSalary.gaji_pokok)}</Text>
                        <TouchableOpacity onPress={handleEditGajiPokok} style={styles.icon}>
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

export default DetailBasicSalaryScreen;
