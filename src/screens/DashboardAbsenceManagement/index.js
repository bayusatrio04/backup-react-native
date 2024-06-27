import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faFileInvoiceDollar, faUsers, faBars, faArrowLeft, faSignInAlt, faUserCheck, faPersonBooth, faHistory, faAddressCard, faMoneyCheckDollar, faHandHoldingDollar, faScaleUnbalanced, faMoneyBillTransfer, faCalendarDay, faListCheck, faCalendarCheck, faCheckDouble, faCircleCheck, faClipboardCheck, faReceipt, faCircleInfo, faCompass, faPaperPlane, faBusinessTime } from '@fortawesome/free-solid-svg-icons';

const DashboardAbsenceManagement = ({ navigation }) => {

    const goToManageAbsensi = () => {
        navigation.navigate('Manage Absensi');
        console.log('Manage Absensi Screen');
    }
    const goToManageStatus = () => {
        navigation.navigate('Manage Status');
        console.log('Manage Status Screen');
    }
    const goToManageType = () => {
        navigation.navigate('Manage Type');
        console.log('Manage Type Screen');
    }
    const goToManageBasicSalary = () => {
        navigation.navigate('Manage Basic Salary');
        console.log('Manage Basic Salary Screen');
    }
    const goToDashboardAdmin = () => {
        navigation.navigate('Dashboard Admin');
        console.log('Dashboard Admin Screen');
    }
    const goToManageDashboarUser = () => {
        navigation.navigate('Manage User Login');
        console.log('Manage User Login Screen');
    }
    const gotoManageOvertime = () => {
        navigation.navigate('Management Overtime');
        console.log('Management Overtime Screen');
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.dasar}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={goToDashboardAdmin}>
                        <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Absence Management</Text>
                </View>
            </View>

            <View style={styles.contentWhite}>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth, {borderLeftColor:'#6759ff'}]} onPress={goToManageAbsensi}>
                <Image source={require('../../assets/images/calendar.jpg')} style={styles.image} />
                    <Text style={[styles.menuText, {color:'#6759ff'}]}>Manage Absensi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth , {borderLeftColor:'#6759ff'}]} onPress={goToManageStatus}>
                <Image source={require('../../assets/images/status.jpg')} style={styles.image} />
                    <Text style={[styles.menuText, {color:'#6759ff'}]}>Manage Status Absensi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth, {borderLeftColor:'#6759ff'}]} onPress={goToManageType}>
                <Image source={require('../../assets/images/type.jpg')} style={styles.image} />
                    <Text style={[styles.menuText, {color:'#6759ff'}]}>Manage Type Absensi</Text>
                </TouchableOpacity>


            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    dasar: {
        backgroundColor: '#6759ff',
        height: 200, // Adjust the height as needed
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 50
    },
    contentWhite: {
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
        borderRadius: 30,
        padding: 30,
        marginTop: -90, // Adjust to position the white content area correctly over the red background
    },
    headerText: {
        fontSize: 24,
        fontWeight: '500',
        color: '#ffffff',
        marginLeft: 30
    },
    notificationButton: {
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row', // Ensure icon and text are in a row
        alignItems: 'center', // Center items vertically
        borderLeftWidth: 1.5,
        borderLeftColor: '#6759ff',
        backgroundColor: '#fff',
        padding: 20,
        margin: 8,
        borderRadius: 8,
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
        shadowOpacity: 0.2, // For iOS shadow
        shadowRadius: 8, // For iOS shadow
    },
    fullWidth: {
        margin: 8,
    },
    menuText: {
        marginLeft: 10, // Add margin to separate icon and text
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },


    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginRight: 10,
      },
});



export default DashboardAbsenceManagement;
