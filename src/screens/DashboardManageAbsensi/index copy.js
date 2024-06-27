import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const DashboardManageAbsensi = ({ navigation }) => {
    const [totals, setTotals] = useState({ total_absensi: 0, total_checkin: 0, total_checkout: 0, total_on_progress: 0 });
    const [absensiLogs, setAbsensiLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // Start with page 1
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default items per page

    useEffect(() => {
        // Reset absensiLogs when page or itemsPerPage changes
        if (page === 1) {
            setAbsensiLogs([]);
        }
        fetchAbsensiLogs();
        fetchTotalAbsensi();
    }, [page, itemsPerPage]); // Fetch logs when page or itemsPerPage changes

    const fetchAbsensiLogs = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token not found');
                return;
            }
            const response = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/index?page=${page}&per-page=${itemsPerPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                // Append new data to existing logs when fetching next page
                setAbsensiLogs(prevLogs => [...prevLogs, ...result.items.filter(item => !prevLogs.find(log => log.id === item.id))]);
            } else {
                Alert.alert('Error', result.messages || 'Failed to fetch absensi logs');
            }
        } catch (error) {
            console.error('Error fetching absensi logs:', error);
            Alert.alert('Error', 'Something went wrong while fetching data');
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalAbsensi = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Error', 'Token tidak ada');
                return;
            }
            const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/total-absensi/total', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                setTotals(result);
            } else {
                Alert.alert('Error', result.messages || 'Failed to fetch total absensi');
            }
        } catch (error) {
            console.error('Error fetching total absensi data:', error);
            Alert.alert('Error', 'Something went wrong while fetching data');
        } finally {
            setLoading(false);
        }
    };

    const renderAbsensiLogs = () => {
        return absensiLogs.map((item, index) => (
            <DataTable.Row key={`${item.id}-${index}`}>
                <DataTable.Cell>#{item.id}</DataTable.Cell>
                <DataTable.Cell>{item.id_absensi_type === 1 ? 'In' : 'Out'}</DataTable.Cell>
                <DataTable.Cell>{item.tanggal_absensi}</DataTable.Cell>
                <DataTable.Cell>{item.waktu_absensi}</DataTable.Cell>
                <DataTable.Cell>{item.created_by}</DataTable.Cell>
            </DataTable.Row>
        ));
    };

    const handleLoadMore = () => {
        setPage(page + 1); // Increment page to fetch next page of data
    };

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                <View style={[styles.card, styles.totalAbsensi]}>
                    <Text style={styles.cardTitle}>Total Absensi</Text>
                    <Text style={styles.cardValue}>{totals.total_absensi}</Text>
                </View>
                <View style={[styles.card, styles.checkinCard]}>
                    <Text style={styles.cardTitle}>Check In</Text>
                    <Text style={styles.cardValue}>{totals.total_checkin}</Text>
                </View>
                <View style={[styles.card, styles.checkoutCard]}>
                    <Text style={styles.cardTitle}>Check Out</Text>
                    <Text style={styles.cardValue}>{totals.total_checkout}</Text>
                </View>
                <View style={[styles.card, styles.onprogressCard]}>
                    <Text style={styles.cardTitle}>On-Progress</Text>
                    <Text style={styles.cardValue}>{totals.total_on_progress}</Text>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
                <ScrollView>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title >ID</DataTable.Title>
                            <DataTable.Title  sortDirection='ascending | descending'>Absensi Type ID</DataTable.Title>
                            <DataTable.Title numeric>Tanggal Absensi</DataTable.Title>
                            <DataTable.Title numeric>Waktu Absensi</DataTable.Title>
                            <DataTable.Title>Create By</DataTable.Title>
                        </DataTable.Header>

                        {renderAbsensiLogs()}

                        <DataTable.Pagination
                            page={page - 1} // DataTable uses 0-based index
                            numberOfPages={Math.ceil(absensiLogs.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page + 1)} // DataTable passes 0-based index
                            label={`${(page - 1) * itemsPerPage + 1}-${Math.min(page * itemsPerPage, absensiLogs.length)} of ${absensiLogs.length}`}
                            numberOfItemsPerPageList={[20, 50, 100]} // Customize as needed
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={setItemsPerPage}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </DataTable>
                    <Button title="Show More" onPress={handleLoadMore} />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
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
    totalAbsensi: {
        backgroundColor: '#e6f7ff',
        borderColor: '#91d5ff',
        borderWidth: 1,
    },
    checkinCard: {
        backgroundColor: '#f6ffed',
        borderColor: '#b7eb8f',
        borderWidth: 1,
    },
    checkoutCard: {
        backgroundColor: '#fff1f0',
        borderColor: '#ffa39e',
        borderWidth: 1,
    },
    onprogressCard: {
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DashboardManageAbsensi;
