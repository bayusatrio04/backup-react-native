import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AbsensiDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const [absensiDetails, setAbsensiDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [positionDetails, setPositionDetails] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Token tidak ada');
            }
            // Fetch absensi details
            const absensiResponse = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/view?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const absensiResult = await absensiResponse.json();
            if (!absensiResponse.ok) {
                throw new Error(absensiResult.messages || 'Failed to fetch absensi details');
            }
            setAbsensiDetails(absensiResult);

            // Fetch user details
            const userResponse = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=user/view&id=${absensiResult.created_by}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const userResult = await userResponse.json();
            if (!userResponse.ok) {
                throw new Error(userResult.messages || 'Failed to fetch user details');
            }
            setUserDetails(userResult);

            // Fetch employee details
            const employeeResponse = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees/view&id=${userResult.employee_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const employeeResult = await employeeResponse.json();
            if (!employeeResponse.ok) {
                throw new Error(employeeResult.messages || 'Failed to fetch employee details');
            }
            setEmployeeDetails(employeeResult);

            // Fetch position details
            if (employeeResult.position_id) {
                const positionResponse = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees/view&id=${employeeResult.position_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const positionResult = await positionResponse.json();
                if (!positionResponse.ok) {
                    throw new Error(positionResult.messages || 'Failed to fetch position details');
                }
                setPositionDetails(positionResult);
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Something went wrong while fetching data');
        } finally {
            setLoading(false);
        }
    };

    const viewOnMap = () => {
        if (absensiDetails && absensiDetails.latitude && absensiDetails.longitude) {
            const url = `https://www.google.co.id/maps/@${absensiDetails.latitude},${absensiDetails.longitude},20z?entry=ttu`;
            Linking.openURL(url);
        } else {
            Alert.alert('Error', 'Coordinates not available.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    if (!absensiDetails || !userDetails || !employeeDetails || !positionDetails) {
        return <Text style={styles.text}>No data available</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Absensi Detail #{absensiDetails.id}</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>User ID:</Text>
                    <Text style={styles.value}>{absensiDetails.created_by}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Nama Lengkap:</Text>
                    <Text style={styles.value}>{employeeDetails.nama_depan} {employeeDetails.nama_belakang}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Posisi Jabatan:</Text>
                    <Text style={styles.value}>{positionDetails.position_name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Waktu Absensi:</Text>
                    <Text style={styles.value}>{absensiDetails.waktu_absensi}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Tipe:</Text>
                    <View style={[styles.badge, { backgroundColor: absensiDetails.id_absensi_type === 1 ? '#4CAF50' : '#f44336' }]}>
                        <Text style={styles.badgeText}>{absensiDetails.id_absensi_type === 1 ? 'Check-in' : 'Check-out'}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Tanggal:</Text>
                    <Text style={styles.value}>{absensiDetails.tanggal_absensi}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Latitude:</Text>
                    <Text style={styles.value}>{absensiDetails.latitude}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Longitude:</Text>
                    <Text style={styles.value}>{absensiDetails.longitude}</Text>
                </View>
                <TouchableOpacity onPress={viewOnMap} style={styles.mapButton}>
                      <Text style={styles.mapButtonText}>View on Map</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={viewOnMap} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit Data</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    card: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#555',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },

    mapButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#4285F4',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      mapButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
     editButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'lightyellow',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      editButtonText: {
        color: 'black',
        fontWeight: 'bold',
      },
});

export default AbsensiDetail;
