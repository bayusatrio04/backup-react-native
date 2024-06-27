import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faSave } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-native-paper';
const UserLoginDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [userDetail, setUserDetail] = useState(null);
    const [editModeUsername, setEditModeUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    

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
            console.log('Berhasil Get data :', id);
            console.log("data userlogin:", response.data);
            // console.log("data username:", userDetail.data.username);
            setUserDetail(response.data);
            setNewUsername(response.data.username);
         
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

    const handleActivedStatus = async () => {
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
            console.log('status id yg mau diubah : ', userDetail.data.id);
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/users/actived?id=${userDetail.data.id}`,
                {},
                config
            );

            if (response.status === 200) {
                console.log('berhasil ubah status menjadi active');
                // Update state userDetail setelah status berhasil diubah
                setUserDetail((prevDetail) => ({
                    ...prevDetail,
                    data: { ...prevDetail.data, status: 10 }
                }));
                Alert.alert('Success', 'User status updated to Active.', [{ text: 'OK' }]);
            }
        } catch (error) {
            console.error('Error change status:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to change status.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };

    const handleDeactivedStatus = async () => {
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
            console.log('status id yg mau diubah : ', userDetail.data.id);
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/users/deactived?id=${userDetail.data.id}`,
                {},
                config
            );

            if (response.status === 200) {
                console.log('berhasil ubah status menjadi deactived');
                // Update state userDetail setelah status berhasil diubah
                setUserDetail((prevDetail) => ({
                    ...prevDetail,
                    data: { ...prevDetail.data, status: 9 }
                }));
                Alert.alert('Success', 'User status updated to Deactive.', [{ text: 'OK' }]);
            }
        } catch (error) {
            console.error('Error change status:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to change status.',
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#c71515',
                style: 'error',
                cancellable: true,
                subTitleStyle: { fontSize: 16 },
            });
        }
    };
    const handleEditUsername = () => {
        setEditModeUsername(true); // Aktifkan mode edit untuk nama posisi
    };

    const handleSaveUsername = async () => {
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
            console.log('username id:', userDetail.data.id);
            const payload = {
                username: newUsername // Pastikan payload hanya berisi username yang baru
            };
    
            console.log('username id:', userDetail.data.id);
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/users/update?id=${userDetail.data.id}`,
                payload,
                config
            );

            if(response.status){
                console.log('Berhasil Update username');
            }
            // Simulasikan permintaan update ke backend
            // Untuk pengujian ini, langsung update ke state userDetail
            setUserDetail((prevDetail) => ({
                ...prevDetail,
                data: { ...prevDetail.data, username: newUsername } // Perbaiki update username di sini
            }));

            setEditModeUsername(false); 
        } catch (error) {
            console.error('Error saving Users:', error);
            SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Failed to save Users.',
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
            <Text style={styles.headerText}>User Login Detail #{userDetail.data.id}</Text>
            <View style={styles.detailContainer}>
            <Text style={styles.label}>Username:</Text>
                {editModeUsername ?(
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.input}
                            value={newUsername}
                            onChangeText={setNewUsername}
  
                        />
                        <TouchableOpacity onPress={handleSaveUsername} style={styles.icon}>
                            <FontAwesomeIcon icon={faSave} size={20} color="#4caf50" />
                        </TouchableOpacity>
                    </View>

                ):(
                    <View style={styles.valueContainer}>

                        <Text style={styles.value}>{userDetail.data.username}</Text>
                        <TouchableOpacity onPress={handleEditUsername} style={styles.icon}>
                            <FontAwesomeIcon icon={faPenToSquare} size={20} color="#6759ff" />
                        </TouchableOpacity>
                    </View>

                )}

            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Password:</Text>
                <Text style={styles.value}>{userDetail.data.password_hash}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Status User:</Text>
                {userDetail.data.status === 9 ? (
                    <>
                        <Text style={[styles.value, { backgroundColor: 'red', alignSelf: 'center', color: 'white', padding: 5, borderRadius: 30, fontSize: 12 }]}>Deactive</Text>
                        <TouchableOpacity onPress={handleActivedStatus}><Text>Aktifkan</Text></TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={[styles.value, { backgroundColor: 'green', alignSelf: 'center', color: 'white', padding: 5, borderRadius: 30, fontSize: 12 }]}>Active</Text>
                        <TouchableOpacity onPress={handleDeactivedStatus}><Text>Non-Aktifkan</Text></TouchableOpacity>
                    </>
                )}
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={resetPassword}>
                <Text style={styles.resetButtonText}>Reset Password to Default</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Employee Management')}>
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

export default UserLoginDetailScreen;
