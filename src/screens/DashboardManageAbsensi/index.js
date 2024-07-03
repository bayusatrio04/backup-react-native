import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardManageAbsensi = ({ navigation }) => {
    const [totals, setTotals] = useState({ total_absensi: 0, total_checkin: 0, total_checkout: 0, total_on_progress: 0 });
    const [absensiLogs, setAbsensiLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    // State for search functionality
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchType, setSearchType] = useState('id'); // 'id' or 'date'

    useEffect(() => {
        fetchTotalAbsensi();
        fetchAllAbsensiLogs(1);
    }, []);

    useEffect(() => {
        if (searchText === '') {
            setSearchResults([]);
        }
    }, [searchText]);

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

    const fetchAllAbsensiLogs = async (page) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token not found');
                return;
            }
    
            const response = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/index?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch absensi logs');
            }
    
            const result = await response.json();
    
            const uniqueLogs = result.items.filter(item => !absensiLogs.some(log => log.id === item.id));
    
            setAbsensiLogs(prevLogs => [...prevLogs, ...uniqueLogs]);
            setHasNextPage(result._meta.currentPage < result._meta.pageCount);
        } catch (error) {
            console.error('Error fetching absensi logs:', error);
            Alert.alert('Error', 'Something went wrong while fetching data');
        } finally {
            setLoading(false);
        }
    };

    const loadMoreData = () => {
        const nextPage = currentPage + 1;
        fetchAllAbsensiLogs(nextPage);
        setCurrentPage(nextPage);
    };

    const renderAbsensiLogs = () => {
        const logsToRender = searchText.length > 0 ? searchResults : absensiLogs;
    
        if (!logsToRender || logsToRender.length === 0) {
            return <Text style={styles.text}>No data available</Text>;
        }
    
        return logsToRender.map((log, index) => {
            const badgeBackgroundColor = log.id_absensi_type === 1 ? 'green' : '#900';
            return (
                <TouchableOpacity key={index} style={styles.logContainer} onPress={() => viewDetail(log.id)}>
                    <View style={[styles.badgeContainer, { backgroundColor: badgeBackgroundColor }]}>
                        <Text style={styles.badgeText}>{log.id_absensi_type === 1 ? 'CHECK-IN' : 'CHECK-OUT'}</Text>
                    </View>
                    <Text style={styles.viewDetailText}>Date: {log.tanggal_absensi}</Text>
                    <Text style={styles.logText}>ID: #{log.id}</Text>
                    <Text style={styles.logText}>Created By: {log.created_by}</Text>
                  
                    <View style={styles.bottomRow}>
                        <Text style={styles.viewDetailText} onPress={() => viewDetail(log.id)}>View Detail</Text>
                        <Text style={[styles.badgeText, styles.absensiTime, { backgroundColor: badgeBackgroundColor }]}>{log.waktu_absensi}</Text>
                    </View>
                </TouchableOpacity>
            );
        });
    };
    
    const viewDetail = (id) => {
        navigation.navigate('AbsensiDetail', { id });
    };

    const searchLogs = async (page = 1) => {
        setIsSearching(true);
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Token not found');
                return;
            }
            
            const response = await fetch(`https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/absensi-log/index?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch absensi logs');
            }
    
            const result = await response.json();
    
            const filteredLogs = result.items.filter(log => {
                if (searchType === 'id') {
                    return searchText && log.id.toString() === searchText;
                }
                return false;
            });
    
            if (filteredLogs.length > 0) {
                setSearchResults(filteredLogs);
                setIsSearching(false);
                setCurrentPage(page);
            } else if (result._meta.currentPage < result._meta.pageCount) {
                searchLogs(page + 1);
            } else {
                Alert.alert('No results found');
                setSearchResults([]);
                setIsSearching(false);
            }
        } catch (error) {
            console.error('Error searching logs:', error);
            Alert.alert('Error', 'Something went wrong while searching data');
            setIsSearching(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by ID..."
                    onChangeText={setSearchText}
                    value={searchText}
                    editable={searchType === 'id'}
                />
                <Button title="Search By ID" onPress={() => { setSearchType('id'); searchLogs(1); }} />
            </View>
            {loading || isSearching ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView>
                    {searchText.length > 0 && searchResults.length > 0 && (
                        <Text style={styles.searchResultsText}>Hasil pencarian untuk ID "{searchText}" ditemukan:</Text>
                    )}
                    {renderAbsensiLogs()}
                    {hasNextPage && !searchText && (
                        <Button title="Load More Data" onPress={loadMoreData} />
                    )}
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
    text: {
        fontSize: 16,
        marginBottom: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        fontSize: 16,
        height: 40,
    },
    searchResultsText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    logContainer: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        position: 'relative',
    },
    logText: {
        fontSize: 16,
        color: '#333',
    },
    viewDetailText: {
        fontSize: 16,
        color: '#007BFF',
    },
    badgeContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    absensiTime: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
});

export default DashboardManageAbsensi;
