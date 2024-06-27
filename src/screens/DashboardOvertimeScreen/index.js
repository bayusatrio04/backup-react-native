import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBan, faCheckDouble, faEye, faPenAlt, faTrash,  } from '@fortawesome/free-solid-svg-icons';
import SweetAlert from 'react-native-sweet-alert';
const OvertimeManagementScreen = ({navigation}) => {
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [pendingOvertime, setPendingOvertime] = useState([]);
    const [approvedOvertime, setApprovedOvertime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reject, setReject] = useState([]);
    const [employeeNames, setEmployeeNames] = useState({});
    const [totals, setTotals] = useState({ total_pending: 0, total_approved: 0, total_rejected: 0, total_all: 0 });
    useEffect(() => {
        if (selectedStatus === 'Pending') {
            fetchPendingOvertime();
        } else if (selectedStatus === 'Approved') {
            fetchApprovedOvertime();
        } else if (selectedStatus === 'Rejected') {
            fetchRejected();
        }
    }, [selectedStatus]);

    const fetchPendingOvertime = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }
            const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/all-pending', 
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.messages === 'success') {
                if (result.data.length === 0) {
                    setPendingOvertime([]);
                    console.log('Tidak ada data Pending');
                } else {
                    setPendingOvertime(result.data);
                    result.data.forEach(item => fetchEmployeeName(item.created_by));
                    console.log('Berhasil get data overtime status pending');
                }
            } else {
                console.log('Tidak ada data Pending', result.messages);
            }
        } catch (error) {
            console.error('Error fetching pending overtime data:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchApprovedOvertime = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }
            const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/all-approved', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.messages === 'success') {
                
                setApprovedOvertime(result.data);
                console.log('Berhasil get data overtime status completed');
            } else {
                Alert.alert('Messages',"Tidak ada data Approved", result.messages);
            }
        } catch (error) {
            console.error('Error fetching completed overtime data:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchRejected = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }
            const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/all-rejected', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.messages === 'success') {
                
                setReject(result.data);
                console.log('Berhasil get data overtime status Reject');
            } else {
              
            }
        } catch (error) {
            console.error('Error fetching all Reject data:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchEmployeeName = async (created_by) => {
        if (employeeNames[created_by]) return; // If name is already fetched, skip
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return null;
            }
            const response = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/get-user/find?id=${created_by}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.messages === 'success') {
                setEmployeeNames(prevNames => ({
                    ...prevNames,
                    [created_by]: result.nama_depan + " " + result.nama_belakang
                }));
                console.log('employee name', result.nama_depan + " " + result.nama_belakang);
            } else {
                console.log('User not found', result.messages);
            }
        } catch (error) {
            console.error('Error fetching employee name:', error);
        }
    };
    
    const overtimeReject = async (id) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }
            const response = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/update?id=${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Rejected' }),
            });
            const result = await response.json();
            if (result) {
                SweetAlert.showAlertWithOptions({
                    title: 'Messages',
                    subTitle: 'Berhasil Rejected Overtime Letter',
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
            } else {
                Alert.alert('Error', 'Gagal melakukan rejected');
            }
        } catch (error) {
            console.error('Error updating overtime status:', error);
        }
    };
    const viewOvertimeDetail = (id) => {
        navigation.navigate('Overtime Detail', { id: id });
        console.log('Detail Overtime Screen : id :', id);

    };

    const overtimeUpdate = (id) => {
        navigation.navigate('Overtime Update', { id: id });
        console.log('Overtime Update Screen : id :', id);
    };
    useEffect(() => {
        fetchTotalOvertime();
    }, []);
    const fetchTotalOvertime = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Error', 'Token tidak ada');
                return;
            }
            const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/total-overtime/total-all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                setTotals(result);
            } else {
                Alert.alert('Error', result.messages || 'Failed to fetch total overtime');
            }
        } catch (error) {
            console.error('Error fetching total overtime data:', error);
            Alert.alert('Error', 'Something went wrong while fetching data');
        } finally {
            setLoading(false);
        }
    };
    const renderContent = () => {
        const getEmployeeName = (id) => employeeNames[id] || 'Loading...';
        switch (selectedStatus) {
            case 'Pending':
                return loading ? (
                    <ActivityIndicator size="large" color="#ff2727" />
                ) : (
                    pendingOvertime.length === 0 ? (
                        <Text style={styles.noDataText}>Tidak ada data Pending</Text>
                    ) : (
                    pendingOvertime.map((item) => (
                        <View key={item.id} style={styles.pendingItem}>
                        <View style={styles.pendingHeader}>
                            <Text style={styles.itemText}>ID: {item.id}</Text>

                            <Text style={styles.pendingDateValue}></Text>
                            <Text style={styles.pendingStatus}>{item.status}</Text>
                        </View>
                        <View style={styles.pendingBody}>
                        <View style={styles.pendingBodyRow}>
                                <Text style={styles.pendingBodyTitle}>Date</Text>
                                <Text style={styles.pendingBodyValue}>{item.overtime_date}</Text>
                            </View>
                            <View style={styles.pendingBodyRow}>
                                <Text style={styles.pendingBodyTitle}>Range Time</Text>
                                <Text style={styles.pendingBodyValue}>{item.start_time} - {item.end_time}</Text>
                            </View>
                            <View style={styles.pendingBodyRow}>
                                <Text style={styles.pendingBodyTitle}>Overtime Hours</Text>
                                <Text style={styles.pendingBodyValue}>{parseInt(item.total_hours)} Jam</Text>
                            </View>

                            <View style={styles.pendingBodyRow}>
                                <Text style={styles.pendingBodyTitle}>Created By</Text>
                                <Text style={styles.pendingBodyValue}>{getEmployeeName(item.created_by)}</Text>                              
                            </View>
                            <View style={[styles.pendingBodyRow, {marginTop:10}]}>
                                <TouchableOpacity style={styles.iconButton} onPress={() => overtimeReject(item.id)} >
                                    <FontAwesomeIcon icon={faBan} size={15} color="red" style={{alignSelf:'center'}} />
                                    <Text>Reject</Text>
                                </TouchableOpacity>
                                <View />
                                <TouchableOpacity style={styles.iconButton} onPress={() => overtimeUpdate(item.id)}> 
                                    <FontAwesomeIcon icon={faCheckDouble} size={15} color="blue" style={{alignSelf:'center'}} />
                                    <Text>Approve</Text>
                                </TouchableOpacity>
                        

                                                         
                            </View>
                        </View>
                    </View>

                    ))
                )
                );
                case 'Approved':
                    return loading ? (
                        <ActivityIndicator size="large" color="#ffa39e" />
                    ) : (
                        
                        approvedOvertime.map((item) => (
                            <View key={item.id} style={styles.approvedItem}>
                                <View style={styles.approvedHeader}>
                                    <Text style={styles.approvedDate}>Approval Date : 
                                      
                                        <Text style={{color:'black', fontWeight:'bold', marginLeft:10}}>{item.approval_date}</Text>
                                      

                                        
                                    </Text>
                                    <Text style={styles.approvedDateValue}></Text>
                                    <Text style={styles.approvedStatus}>{item.status}</Text>
                                </View>

                                <View style={styles.approvedBody}>
                                    <View style={styles.approvedBodyRow}>
                                        <Text style={styles.approvedBodyTitle}>Request Date :</Text>
                                        <Text style={styles.approvedBodyValue}>{item.overtime_date}</Text>
                                    </View>
                                    <View style={styles.approvedBodyRow}>
                                        <Text style={styles.approvedBodyTitle}>Range Time</Text>
                                        <Text style={styles.approvedBodyValue}>{item.start_time} - {item.end_time}</Text>
                                    </View>
                                    <View style={styles.approvedBodyRow}>
                                        <Text style={styles.approvedBodyTitle}>Overtime Hours</Text>
                                        <Text style={styles.approvedBodyValue}>{parseInt(item.total_hours)} Jam</Text>
                                    </View>

                                    <View style={styles.approvedBodyRow}>
                                    <Text style={styles.approvedBodyTitle}>Approved By</Text>
                                        {item.manager_signature === 1 ? (
                                            <Text style={styles.approvedBodyValue}>Admin</Text>
                                        ) : null}
                                        
                                    </View>
                                    <View style={[styles.pendingBodyRow, {marginTop:10}]}>
                                        <View />
                                        <TouchableOpacity style={styles.iconButton} onPress={() => viewOvertimeDetail(item.id)} >
                                            <FontAwesomeIcon icon={faEye} size={15} color="blue" style={{alignSelf:'center'}} />
                                            <Text>Detail</Text>
                                        </TouchableOpacity>
                                        <View />

                                                         
                                    </View>
                                </View>
                            </View>
                        ))
                    );
                    case 'Rejected':
                        return loading ? (
                            <ActivityIndicator size="large" color="#4CAF50" />
                        ) : reject.length === 0 ? (
                            <Text style={styles.noDataText}>Tidak ada data Overtime</Text>
                        ) : (
                            reject.map((item) => (
                                <View key={item.id} style={styles.rejectedItem}>
                                <View style={styles.rejectedHeader}>
                                    <Text style={styles.rejectedDate}>Date : 
                                      
                                        <Text style={{color:'black', fontWeight:'bold', marginLeft:10}}>{item.overtime_date}</Text>
                                      

                                        
                                    </Text>
                                    <Text style={styles.rejectedDateValue}></Text>
                                    <Text style={styles.rejectedStatus}>{item.status}</Text>
                                </View>

                                <View style={styles.rejectedBody}>
                                    <View style={styles.rejectedBodyRow}>
                                        <Text style={styles.rejectedBodyTitle}>Date :</Text>
                                        <Text style={styles.rejectedBodyValue}>{item.overtime_date}</Text>
                                    </View>
                                    <View style={styles.rejectedBodyRow}>
                                        <Text style={styles.rejectedBodyTitle}>Range Time</Text>
                                        <Text style={styles.rejectedBodyValue}>{item.start_time} - {item.end_time}</Text>
                                    </View>
                                    <View style={styles.rejectedBodyRow}>
                                        <Text style={styles.rejectedBodyTitle}>Overtime Hours</Text>
                                        <Text style={styles.rejectedBodyValue}>{parseInt(item.total_hours)} Jam</Text>
                                    </View>

                                    <View style={styles.rejectedBodyRow}>
                                    <Text style={styles.rejectedBodyTitle}>rejected By</Text>
                                        {item.manager_signature === 0 || item.manager_signature === 1? (
                                            <Text style={styles.rejectedBodyValue}>Admin</Text>
                                        ) : null}
                                        
                                    </View>
                                </View>
                            </View>
                            ))
                        );
            default:
                return <Text>Select a status to view the requests</Text>;
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>All</Text> */}
            <View style={styles.grid}>
                <View style={[styles.card, styles.balanceCard]}>
                    <Text style={styles.cardTitle}>Total</Text>
                    <Text style={styles.cardValue}>{totals.total_all}</Text>
                </View>
                <View style={[styles.card, styles.approvedCard]}>
                    <Text style={styles.cardTitle}>Approved</Text>
                    <Text style={styles.cardValue}>{totals.total_approved}</Text>
                </View>
                <View style={[styles.card, styles.pendingCard]}>
                    <Text style={styles.cardTitle}>Pending</Text>
                    <Text style={styles.cardValue}>{totals.total_pending}</Text>
                </View>
                <View style={[styles.card, styles.cancelledCard]}>
                    <Text style={styles.cardTitle}>Rejected</Text>
                    <Text style={styles.cardValue}>{totals.total_rejected}</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, selectedStatus === 'Pending' && styles.selectedButton]}
                    onPress={() => setSelectedStatus('Pending')}
                >
                    <Text style={styles.buttonText}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedStatus === 'Approved' && styles.selectedButton]}
                    onPress={() => setSelectedStatus('Approved')}
                >
                    <Text style={styles.buttonText}>Approved</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedStatus === 'Rejected' && styles.selectedButton]}
                    onPress={() => setSelectedStatus('Rejected')}
                >
                    <Text style={styles.buttonText}>Rejected</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentContainer}>
                {renderContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    button: {
        flex: 1,
        padding: 16,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: '#ccc',
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#6759ff',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    overtimeItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },

    pendingItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    pendingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pendingDate: {
        fontSize: 16,
        color: '#333',
    },
    pendingDateValue: {
        fontSize: 14,
        color: '#333',
    },
    pendingStatus: {
        backgroundColor: '#e6f7ff',
        color: 'red',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
    },
    pendingBody: {
        marginTop: 10,
    },
    pendingBodyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    pendingBodyTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    pendingBodyValue: {
        fontSize: 14,
        color: '#333',
    },


    approvedItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    approvedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    approvedDate: {
        fontSize: 16,
        color: '#333',
    },
    approvedDateValue: {
        fontSize: 14,
        color: '#333',
    },
    approvedStatus: {
        backgroundColor: '#e6f7ff',
        color: '#52c41a',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
    },
    approvedBody: {
        marginTop: 10,
    },
    approvedBodyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    approvedBodyTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    approvedBodyValue: {
        fontSize: 14,
        color: '#333',
    },


    rejectedItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    rejectedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rejectedDate: {
        fontSize: 16,
        color: '#333',
    },
    rejectedDateValue: {
        fontSize: 14,
        color: '#333',
    },
    rejectedStatus: {
        backgroundColor: '#e6f7ff',
        color: '#C8CF7B',
        paddingVertical: 2, 
        paddingHorizontal: 8,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
    },
    rejectedBody: {
        marginTop: 10,
    },
    rejectedBodyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    rejectedBodyTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    rejectedBodyValue: {
        fontSize: 14,
        color: '#333',
    },


    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    balanceCard: {
        backgroundColor: '#e6f7ff',
        borderColor: '#91d5ff',
        borderWidth: 1,
    },
    approvedCard: {
        backgroundColor: '#f6ffed',
        borderColor: '#b7eb8f',
        borderWidth: 1,
    },
    pendingCard: {
        backgroundColor: '#fff1f0',
     
        borderColor: '#ffa39e',
        borderWidth: 1,
    },
    cancelledCard: {
        backgroundColor: '#fff7e6',

        borderColor: '#ffe58f',
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
        
    }
});

export default OvertimeManagementScreen;
