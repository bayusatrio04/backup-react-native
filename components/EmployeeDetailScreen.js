import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios'; // Import Axios library
import SweetAlert from 'react-native-sweet-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
const EmployeeDetailScreen = ({ route, navigation }) => {
    const { id } = route.params; // Dapatkan ID karyawan dari params navigasi
    const [employeeDetail, setEmployeeDetail] = useState(null);
    console.log(employeeDetail);

    useEffect(() => {
        fetchEmployeeDetail();
    }, []);

    const fetchEmployeeDetail = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token); 
        
            if (!token) {
              throw new Error('Token tidak ditemukan di AsyncStorage');
            }
            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees/view&id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setEmployeeDetail(response.data);
        // Jika ada employeeDetail.position_id, tambahkan position_name ke employeeDetail
        if (response.data.position_id) {
            const positionResponse = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Membuat map dari data posisi untuk referensi
            const positionsData = positionResponse.data;

            // Mencari posisi yang sesuai berdasarkan id
            const position = positionsData.find(pos => pos.id === response.data.position_id);

            // Mengupdate employeeDetail dengan position_name
            setEmployeeDetail(prevEmployeeDetail => ({
                ...prevEmployeeDetail,
                position_name: position ? position.position_name : 'Unknown'
            }));
        }
        } catch (error) {
            console.error('Error fetching employee detail:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to fetch employee detail.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

    if (!employeeDetail) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Employee Detail</Text>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>
                    {employeeDetail.nama_depan} {employeeDetail.nama_belakang}
                </Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{employeeDetail.email}</Text>

                <Text style={styles.label}>Date of Birth:</Text>
                <Text style={styles.value}>{employeeDetail.tanggal_lahir}</Text>

                <Text style={styles.label}>Gender:</Text>
                <Text style={styles.value}>{employeeDetail.jenis_kelamin}</Text>

                <Text style={styles.label}>Marital Status:</Text>
                <Text style={styles.value}>{employeeDetail.status_nikah}</Text>

                <Text style={styles.label}>Number of Dependents:</Text>
                <Text style={styles.value}>{employeeDetail.jumlah_tanggungan}</Text>

                <Text style={styles.label}>Phone Number:</Text>
                <Text style={styles.value}>{employeeDetail.no_telepon}</Text>

                <Text style={styles.label}>Position:</Text>
                <Text style={styles.value}>{employeeDetail.position_name}</Text>

                <Text style={styles.label}>Employee Type:</Text>
                <Text style={styles.value}>{employeeDetail.type_karyawan}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Back</Text>
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
    },
    detailContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#6759ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default EmployeeDetailScreen;
