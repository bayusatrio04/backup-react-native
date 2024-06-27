import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';

const DashboardManageAbsensi = ({ navigation }) => {
    const [totals, setTotals] = useState({ total_absensi: 0, total_checkin: 0, total_checkout: 0, total_on_progress: 0 });
    const [absensiLogs, setAbsensiLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true); // Flag to track if there's more data to load

    // State for search functionality
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchTotalAbsensi();
        fetchAllAbsensiLogs(1); // Start fetching from page 1
    }, []);

    useEffect(() => {
        if (searchText === '') {
            setSearchResults([]);
        }
    }, [searchText]);

    console.log('total datanya : ', totals.total_absensi);

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
    
            // Filter out duplicates before updating state
            const uniqueLogs = result.items.filter((item) => {
                // Use Set to track existing log ids
                return !absensiLogs.some((log) => log.id === item.id);
            });
    
            // Update state based on current and new data
            setAbsensiLogs(prevLogs => [...prevLogs, ...uniqueLogs]);
            setHasNextPage(result._meta.currentPage < result._meta.pageCount); // Check if there's another page
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

        return logsToRender.map((log, index) => (
            <Card key={index} style={styles.card} onPress={() => viewDetail(log.id)}>
                <Card.Content>
                    <Title>ID: #{log.id}</Title>
                    <Paragraph>User ID: {log.created_by}</Paragraph>
                </Card.Content>
                <Card.Actions>
                    <TouchableOpacity onPress={() => viewDetail(log.id)}>
                        <Text style={styles.viewDetailText}>View Detail</Text>
                    </TouchableOpacity>
                </Card.Actions>
            </Card>
        ));
    };

    const viewDetail = (id) => {
        navigation.navigate('AbsensiDetail', { id });
        console.log('id yg dibwa:', id)
    };

    // Function to perform search
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
    
            const foundLog = result.items.find(log => log.id.toString() === searchText);

            if (foundLog) {
                setSearchResults([foundLog]); // Set hasil pencarian
                setIsSearching(false);
                setCurrentPage(page); // Set halaman saat ini ke halaman tempat ID ditemukan
            } else if (result._meta.currentPage < result._meta.pageCount) {
                // Lanjutkan ke halaman berikutnya jika tidak ditemukan dan masih ada halaman
                searchLogs(page + 1);
            } else {
                // Jika tidak ditemukan dan tidak ada halaman lagi
                Alert.alert('ID not found');
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
                    placeholder="Search by log ID..."
                    onChangeText={text => setSearchText(text)}
                    value={searchText}
                />
                <Button title="Search" onPress={() => searchLogs(1)} />
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
                        <Button title="Load More" onPress={loadMoreData} />
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
    card: {
        marginBottom: 16,
        borderRadius: 8,
        elevation: 4,
    },
    viewDetailText: {
        color: 'blue',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        textDecorationLine: 'underline',
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
});

export default DashboardManageAbsensi;
