import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserLoginDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [userDetail, setUserDetail] = useState(null);


    console.log('Berhasil Get id :', id);

    const fetchUserDetail = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }
            const response = await axios.get(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/users/read?id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("data userlogin:", response.data);
            setUserDetail(response.data);
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

    const resetPassword = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', token);

            if (!token) {
                throw new Error('Token tidak ditemukan di AsyncStorage');
            }
            const response = await axios.post(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/users/reset-password`,
                { id: userDetail.data.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', 'Password has been reset to default.', [{ text: 'OK' }]);
        } catch (error) {
            console.error('Error resetting password:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to reset password.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };



    useEffect(() => {
        fetchUserDetail();
    }, []);

    if (!userDetail) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>User Login Detail</Text>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Username:</Text>
                <Text style={styles.value}>{userDetail.data.username}</Text>

                <Text style={styles.label}>Password:</Text>
                <Text style={styles.value}>{userDetail.data.password_hash}</Text>
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={resetPassword}>
                <Text style={styles.resetButtonText}>Reset Password to Default</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
    value: {
        fontSize: 16,
        marginBottom: 15,
        color: '#666',
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
});

export default UserLoginDetailScreen;
