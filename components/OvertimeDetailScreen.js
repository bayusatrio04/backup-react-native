import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OvertimeDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
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
    useEffect(() => {
        fetchOvertimeDetails();
    }, []);

    const fetchOvertimeDetails = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token Tidak ada');
                return;
            }
            const response = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/overtime/view?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            // console.log(result);
            if (result) {
                setDetails(result);
            } else {
                Alert.alert('Error', 'Failed to fetch overtime details');
            }
        } catch (error) {
            console.error('Error fetching overtime details:', error);
            Alert.alert('Error', 'Something went wrong while fetching data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <View style={[styles.loadingContainer, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#ff2727" />
                </View>
            ) : details ? (
                <View style={styles.detailContainer}>
                    <Text style={styles.header}>Overtime Details</Text>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Overtime Date:</Text>
                        <Text style={styles.value}>{details.overtime_date}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Start Time:</Text>
                        <Text style={styles.value}>{details.start_time}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>End Time:</Text>
                        <Text style={styles.value}>{details.end_time}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Total Hours:</Text>
                        <Text style={styles.value}>{parseInt(details.total_hours)} Jam</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Overtime Reason:</Text>
                        <Text style={styles.value}>{details.overtime_reason}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.value}>{details.status}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Approval Date:</Text>
                        <Text style={styles.value}>{details.approval_date}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Overtime Tasks:</Text>
                        <Text style={styles.value}>{details.overtime_tasks}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Overtime Rate:</Text>
                        <Text style={styles.value}>{formatCurrency(details.overtime_rate)}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Total Compensation:</Text>
                        <Text style={styles.value}>{formatCurrency(details.total_compensation)}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Additional Notes:</Text>
                        <Text style={styles.value}>{details.additional_notes}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Created At:</Text>
                        <Text style={styles.value}>{details.created_at}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.label}>Updated At:</Text>
                        <Text style={styles.value}>{details.updated_at}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.noDataText}>No Details Available</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 3, // Android elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333333',
    },
    infoSection: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666666',
    },
    value: {
        fontSize: 16,
        color: '#333333',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#333333',
    },
});



export default OvertimeDetailScreen;
