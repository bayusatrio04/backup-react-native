import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faFileInvoiceDollar, faUsers, faBars, faArrowLeft, faSignInAlt, faUserCheck, faPersonBooth, faHistory, faAddressCard, faMoneyCheckDollar, faHandHoldingDollar, faScaleUnbalanced, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';

const DashboardPayrollManagement = ({ navigation }) => {

    const goToPayrolls = () => {
        navigation.navigate('Payrolls');
        console.log('Payrolls Screen');
    }
    const goToManageTax = () => {
        navigation.navigate('Tax');
        console.log('Tax Screen');
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
                    <Text style={styles.headerText}>Payroll Management</Text>
                </View>
            </View>

            <View style={styles.contentWhite}>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth, {borderLeftColor:'#EC353A'}]} onPress={goToPayrolls}>
                <Image source={require('../../assets/images/payrolls.jpg')} style={styles.image} />
                    <Text style={[styles.menuText, {color:'#EC353A'}]}>Payrolls</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth , {borderLeftColor:'#EC353A'}]} onPress={goToManageTax}>
                <Image source={require('../../assets/images/tax.jpg')} style={styles.image} />
                    <Text style={[styles.menuText, {color:'#EC353A'}]}>Manage Tax</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth, {borderLeftColor:'#EC353A'}]} onPress={goToManageBasicSalary}>
                <Image source={require('../../assets/images/basic_salary.jpg')} style={styles.image} />
                    <Text style={[styles.menuText, {color:'#EC353A'}]}>Manage Basic Salary</Text>
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
        backgroundColor: '#EC353A',
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
        borderLeftColor: '#EC353A',
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

export default DashboardPayrollManagement;
