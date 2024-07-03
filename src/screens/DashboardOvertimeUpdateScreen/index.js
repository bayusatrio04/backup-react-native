import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
const OvertimeUpdateScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [overtimeDetails, setOvertimeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRate, setSelectedRate] = useState(null);
    const [totalOvertime, setTotalOvertime] = useState(0); // State untuk total lemburan

    const handleRateSelection = (overtime_rate) => {
        setSelectedRate(overtime_rate);
        setModalVisible(false);
        // Hitung total lemburan
        const total = overtime_rate * overtimeDetails.total_hours;
        setTotalOvertime(total);
        // Jika Anda ingin mengupdate state overtimeDetails dengan rate yang dipilih:
        setOvertimeDetails({ ...overtimeDetails, overtime_rate: overtime_rate });
    };

    const formatCurrency = (amount) => {
        return `Rp.${amount.toLocaleString('id-ID')}`;
    };

    useEffect(() => {
        fetchOvertimeDetails(id);
    }, [id]);

    const fetchOvertimeDetails = async (overtimeId) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }
            const response = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/view?id=${overtimeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const responseText = await response.text();
            try {
                const result = JSON.parse(responseText);
                if (response.ok) {
                    setOvertimeDetails(result);
                } else {
                    console.error('Error fetching overtime details:', result);
                    Alert.alert('Error', 'Failed to fetch overtime details.');
                }
            } catch (e) {
                console.error('Error parsing response as JSON:', e);
                console.error('Response text:', responseText);
                Alert.alert('Error', 'Failed to parse server response.');
            }

        } catch (error) {
            console.error('Error fetching overtime details:', error);
            Alert.alert('Error', 'Failed to fetch overtime details.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }
            const approvalDate = moment().format('YYYY-MM-DD'); 
            const overtimeTask = "Lembur Approved "+ approvalDate; 
            const managerSignature = 1;
            const status = "Approved";
            const updatedOvertime = {
                ...overtimeDetails,
                approval_date: approvalDate,
                total_compensation: totalOvertime,
                overtime_tasks:overtimeTask,
                manager_signature:managerSignature,
                status:status
            };
            const response = await axios.put(
                `https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/update?id=${id}`,
                updatedOvertime,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            SweetAlert.showAlertWithOptions({
                title: 'Messages',
                subTitle: 'Berhasil Approval Overtime',
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
              navigation.navigate('Employee Management');
              navigation.navigate('Management Overtime');
            console.log('Data Overtime Berhasil do Approval !');
        } catch (error) {
            console.error('Error updating overtime:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!overtimeDetails) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Error Loading Overtime Details</Text>
            </View>
        );
    }

    const handleEmployeeSignatureChange = (text) => {
        const value = text === 'Setuju' ? 1 : 0;
        setOvertimeDetails({ ...overtimeDetails, employee_signature: value });
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerDetail}>
       
                <View style={styles.detailContainer}>
                    <Text style={styles.title}>Overtime Details ID :   <Text style={styles.value}>{overtimeDetails.id}</Text></Text>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>{overtimeDetails.overtime_date}</Text>
                    <Text style={styles.label}>Reason</Text>
                    <Text style={styles.value}>{overtimeDetails.overtime_reason}</Text>
                    <Text style={styles.label}>Start Time</Text>
                    <Text style={styles.value}>{overtimeDetails.start_time}</Text>
                    <Text style={styles.label}>End Time</Text>
                    <Text style={styles.value}>{overtimeDetails.end_time}</Text>
                    <Text style={styles.label}>Total Hours</Text>
                    <Text style={styles.value}>{overtimeDetails.total_hours}</Text>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>{overtimeDetails.status}</Text>
                
                  
                </View>

            </View>
            <Text style={styles.header}>Form Approved Overtime</Text>
            <View style={styles.formContainer}>
 
                <TouchableOpacity style={styles.rateButton} onPress={() => setModalVisible(true)}>
                    <Text style={{color:'white'}}>{selectedRate ? `Gaji Overtime/Jam: ${formatCurrency(selectedRate)}` : 'Pilih Rate Overtime'}</Text>
                </TouchableOpacity>
                <Text style={styles.label}>Total Compensation</Text>
                <TextInput
                    style={styles.input}
                    value={String(totalOvertime)} // Tampilkan total lemburan
                    onChangeText={(text) => setTotalOvertime(text)}
                    editable={false}
                />
                <Text style={styles.label}>Notes (Optional)</Text>
                <TextInput
                    style={styles.input}
                    value={overtimeDetails.additional_notes}
                    onChangeText={(text) => setOvertimeDetails({ ...overtimeDetails, additional_notes: text })}
                    placeholder="Enter additional notes..."
                    multiline
                />
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={updating}>
                    {updating ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styles.buttonText}>Process now</Text>
                    )}
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Pilih Rate Overtime</Text>
                        <FlatList
                            data={[10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000 , 14500, 15000]}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.rateOption}
                                    onPress={() => handleRateSelection(item)}
                                >
                                    <Text>{formatCurrency(item)}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.toString()}
                            
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    containerDetail: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    detailContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginTop: 5,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        fontSize: 16,
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    updateButton: {
        backgroundColor: 'blue',
        padding: 16,
        marginTop: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom:30
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },


    rateButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        color:'white',
        marginTop:10,
        marginBottom:10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    rateOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },

    closeButton: {
        marginTop: 10,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default OvertimeUpdateScreen;
