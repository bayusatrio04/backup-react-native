import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, FlatList, Modal, Button, Dimensions  } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong, faCalendarDays, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/index';
import getSalary from '../../api/getSalary';
import NetInfo from '@react-native-community/netinfo';
const { width } = Dimensions.get('window');
const PayslipScreen = ({ navigation }) => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11
    const currentYear = new Date().getFullYear();
    const bulan = currentMonth.toString().padStart(2, '0');
    const tahun = currentYear.toString();
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [yearModalVisible, setYearModalVisible] = useState(false);
    const [salaryData, setSalaryData] = useState(null);
    const [isConnected, setIsConnected] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(bulan);
    const [selectedYear, setSelectedYear] = useState(tahun);

    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const [months, setMonths] = useState([
        { id: '01', name: 'January' },
        { id: '02', name: 'February' },
        { id: '03', name: 'March' },
        { id: '04', name: 'April' },
        { id: '05', name: 'May' },
        { id: '06', name: 'June' },
        { id: '07', name: 'July' },
        { id: '08', name: 'August' },
        { id: '09', name: 'September' },
        { id: '10', name: 'October' },
        { id: '11', name: 'November' },
        { id: '12', name: 'December' },
    ]);
    
    const [years, setYears] = useState(Array.from({ length: 12 }, (_, i) => (new Date().getFullYear() - 10) + i));

    const handleMonthSelect = (selectedMonth) => {
        setSelectedMonth(selectedMonth);
        toggleMonthPicker();
    };

    const handleYearSelect = (selectedYear) => {
        setSelectedYear(selectedYear.toString());
        toggleYearPicker();
    };

    const toggleMonthPicker = () => setShowMonthPicker(!showMonthPicker);
    const toggleYearPicker = () => setShowYearPicker(!showYearPicker);

    useEffect(() => {
        const checkConnection = async () => {
            const state = await NetInfo.fetch();
            setIsConnected(state.isConnected);
            if (!state.isConnected) {
                Alert.alert('No Internet Connection', 'Check your internet connection!');
            }
        };

        checkConnection();
    }, []);

    const BackToHome = () => {
        navigation.navigate('Home');
        console.log('Home Screen');
    };
 

    useEffect(() => {
        const fetchSalaryData = async () => {
            if (isConnected) {
                try {
                    const data = await getSalary(selectedMonth, selectedYear);
                    if (data) {
                        if (data.Status === "200") {
                            // Alert.alert('Success', 'Data Found !');
                            setSalaryData(data);
                        } else {
                            Alert.alert('Error', 'No salary data available for the selected month and year.');
                           await navigation.navigate('Home');
                           await navigation.navigate("PayslipScreen");
                        }
                    } else {
                        Alert.alert('Error', 'No data returned from the server.');
                    }
                } catch (error) {
                    console.error('Error fetching salary data:', error);
                    Alert.alert('Error', 'Failed to fetch salary data.');
                }
            }   
        };
    
        fetchSalaryData();
    }, [isConnected, selectedMonth, selectedYear]);

    if (!isConnected) {
        return (
            <View style={styles.container}>
                <Text style={styles.alertText}>Check your internet connection!</Text>
            </View>
        );
    };

    if (!salaryData) {
        return (
            <View style={styles.containerLoading}>
                <Text>Loading...</Text>
            </View>
        );
    };
    if (salaryData.Status === "204") {
        return (
            <View style={styles.container}>
                <Text style={styles.alertText}>{salaryData.Messages}</Text>
            </View>
        );
    };
    const { Month, data } = salaryData;
    const salaryDetails = data[0] || {
        'Total Gaji': 0,
        'Pajak PPh21': 0,
        'Gaji Pokok': 0,
        'Tunjangan Makan per-Month': 0,
    };
    const formatRupiah = (angka) => {
        let reverse = angka.toString().split('').reverse().join('');
        let ribuan = reverse.match(/\d{1,3}/g);
        let formatted = ribuan.join('.').split('').reverse().join('');
        return `Rp.${formatted}`;
      };

      const calculateNetBrutoBulan = 
      salaryDetails['Gaji Pokok'] + 
      salaryDetails['Total Tunjangan Makan'] - 
      salaryDetails['Total Deductions Biaya Jabatan'] - 
      salaryDetails['Total Deductions Iuran Pensiun'];
      const calculateNetBrutoseTahun = calculateNetBrutoBulan * 12;
      const pkp = calculateNetBrutoseTahun - salaryDetails['Total PTKP'];

      const goToAttendance =() =>{
        navigation.navigate('Attendance Summary'); 
        console.log('History Attendance Screen')
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.paySlipButton} onPress={BackToHome}>
                    <FontAwesomeIcon icon={faArrowLeftLong} size={20} color="#feefef" />
                    <Text style={styles.headerTextPaySlip}>My Payslip</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>
            <ScrollView>
                <View style={styles.infoSalaryContainer}>
                    <View style={styles.infoSalary}>
                        <View style={styles.salaryTextContainer}>
                            <Text style={styles.salaryText}>Your salary this month</Text>
                            <Text style={styles.salaryText}>{Month}</Text>
                        </View>
                        <View style={styles.salarySaldoContainer}>
                            <Text style={styles.salaryRP}><Text style={styles.salarySaldo}>{formatRupiah(salaryDetails['Earnings'])}</Text></Text>
                            <View style={styles.chartCircle}><Text style={styles.textChart}>100%</Text></View>
                        </View>
                        <View style={styles.stat}>
                            <TouchableOpacity onPress={goToAttendance}>

                            <Text style={styles.statText}>View Statistic</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.periodeContainer}>
                        <Text style={styles.periodeText}>Periode Payslip</Text>
                        <TouchableOpacity style={styles.periodeMonth} onPress={toggleMonthPicker}>
                            <View style={styles.periodeIcon}>
                                <FontAwesomeIcon icon={faCalendarDays} size={25} color="white" style={styles.iconCalendar} />
                            </View>
                            <Text style={styles.periodeTextMonth}>{selectedMonth || 'Select Month'}</Text>
                            <FontAwesomeIcon icon={faChevronDown} size={15} color="#898383" style={styles.iconCalendar} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.periodeYear} onPress={toggleYearPicker}>
                            <View style={styles.periodeIcon}>
                                <FontAwesomeIcon icon={faCalendarDays} size={25} color="white" style={styles.iconCalendar} />
                            </View>
                            <Text style={styles.periodeTextMonth}>{selectedYear || 'Select Year'}</Text>
                            <FontAwesomeIcon icon={faChevronDown} size={15} color="#898383" style={styles.iconCalendar} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.earningContainer}>
                        <SafeAreaView>
                            <Text style={styles.earnings}>Increase Salary</Text>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Basic Salary</Text>
                                <Text style={styles.textRP}>+ {formatRupiah(salaryDetails['Gaji Pokok'])}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Meal Allowance</Text>
                                <Text style={styles.textRP}>+ {formatRupiah(salaryDetails['Total Tunjangan Makan'])}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Family Allowance</Text>
                                <Text style={styles.textRP}>+ Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Transportation Allowance</Text>
                                <Text style={styles.textRP}>+ Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Overtime Allowance</Text>
                                <Text style={styles.textRP}>+ Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Position Allowance</Text>
                                <Text style={styles.textRP}>+ Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Bonus Attendance</Text>
                                <Text style={styles.textRP}>+ Rp.0</Text>
                            </View>


                        </SafeAreaView>
                    </View>
                    <View style={styles.deductionContainer}>
                    <SafeAreaView>
                        <Text style={styles.deductions}>Deductions</Text>
                        <View style={styles.deductionsAllowance}>
                            <Text style={styles.textAllowance}>Biaya Jabatan</Text>
                            <Text style={styles.textRP}>- {formatRupiah(salaryDetails['Total Deductions Biaya Jabatan'])}</Text>
                        </View>
                        <View style={styles.deductionsAllowance}>
                            <Text style={styles.textAllowance}>Iuran Pensiun</Text>
                            <Text style={styles.textRP}>- {formatRupiah(salaryDetails['Total Deductions Iuran Pensiun'])}</Text>
                        </View>
                        <View style={styles.deductionsAllowance}>
                            <Text style={styles.textAllowance}>BPJS Kesehatan</Text>
                            <Text style={styles.textRP}>- {formatRupiah(salaryDetails['Total Deductions Bpjs Kesehatan'])}</Text>
                        </View>
                        <View style={styles.deductionsAllowance}>
                            <Text style={styles.textAllowance}>JHT Karyawan</Text>
                            <Text style={styles.textRP}>- {formatRupiah(salaryDetails['Total Deductions Bpjs Ketenagakerjaan'])}</Text>
                        </View>
                        <View style={styles.deductionsAllowance}>
                            <Text style={styles.textAllowance}>Pajak PPh21</Text>
                            <Text style={styles.textRP}>- {formatRupiah(salaryDetails['Total PPh 21'])}</Text>
                        </View>

                    </SafeAreaView>
                    </View>
                    <View style={styles.earningContainer}>
                        <SafeAreaView>
                            <Text style={styles.earnings}>Calculate</Text>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Golongan PTKP (Penghasilan Tidak Kena Pajak)</Text>
                                <Text style={styles.textRP}>{salaryDetails['Golongan PTKP']}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>PTKP (Penghasilan Tidak Kena Pajak)</Text>
                                <Text style={styles.textRP}>{formatRupiah(salaryDetails['Total PTKP'])}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Basic Salary</Text>
                                <Text style={styles.textRP}> {formatRupiah(salaryDetails['Gaji Pokok'])}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Meal Allowance</Text>
                                <Text style={styles.textRP}> {formatRupiah(salaryDetails['Total Tunjangan Makan'])}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Family Allowance</Text>
                                <Text style={styles.textRP}> Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Transportation Allowance</Text>
                                <Text style={styles.textRP}> Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Overtime Allowance</Text>
                                <Text style={styles.textRP}> Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Position Allowance</Text>
                                <Text style={styles.textRP}> Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Bonus Attendance</Text>
                                <Text style={styles.textRP}>Rp.0</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Deductions Biaya Jabatan</Text>
                                <Text style={styles.textRP}> {formatRupiah(salaryDetails['Total Deductions Biaya Jabatan'])}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Deductions Biaya Iuran</Text>
                                <Text style={styles.textRP}> {formatRupiah(salaryDetails['Total Deductions Iuran Pensiun'])}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Deductions PPh21</Text>
                                <Text style={styles.textRP}> {formatRupiah(salaryDetails['Total PPh 21'])}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Total Gaji Bruto <Text style={{ color:'red' }}>(Month)</Text> </Text>
                                <Text style={styles.textRP}> {formatRupiah(calculateNetBrutoBulan)}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Total Gaji Bruto <Text style={{ color:'red' }}>(Year)</Text> </Text>
                                <Text style={styles.textRP}> {formatRupiah(calculateNetBrutoseTahun)}</Text>
                            </View>
                            <View style={styles.earningsAllowance}>
                                <Text style={styles.textAllowance}>Total PKP (Penghasilan Kena Pajak) </Text>
                                <Text style={styles.textRP}> {formatRupiah(pkp)}</Text>
                            </View>
                          
                            <View style={styles.totalEarningsContainer}>
                                <View style={styles.totalEarnings}>
                                    <Text style={styles.earnings}>Total Earnings</Text>
                                    <Text style={styles.textTotal}> {formatRupiah(salaryDetails['Earnings'])}</Text>
                                </View>
                            </View>
                        </SafeAreaView>
                    </View>

                </View>
            </ScrollView>
            <Modal animationType="slide" transparent={true} visible={showMonthPicker}>
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                    <Text style={styles.modalHeaderText}>Select Month</Text>
                    <TouchableOpacity onPress={toggleMonthPicker}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    </View>
                    <FlatList
                    data={months}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleMonthSelect(item.id)}>
                        <Text style={styles.modalItem}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    />
                </View>
                </View>
            </Modal>
            <Modal animationType="slide" transparent={true} visible={showYearPicker}>
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                    <Text style={styles.modalHeaderText}>Select Year</Text>
                    <TouchableOpacity onPress={toggleYearPicker}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    </View>
                    <FlatList
                    data={years}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleYearSelect(item)}>
                        <Text style={styles.modalItem}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    />
                </View>
                </View>
            </Modal>
        </View>
    );
};

export default PayslipScreen;
