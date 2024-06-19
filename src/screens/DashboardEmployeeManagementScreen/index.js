import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faFileInvoiceDollar, faUsers, faBars, faArrowLeft, faSignInAlt, faUserCheck, faPersonBooth, faHistory, faAddressCard } from '@fortawesome/free-solid-svg-icons';

const DashboardEmployeeManagement = ({ navigation }) => {

    const goToEmployees = () => {
        navigation.navigate('Employees');
        console.log('Employees Screen');
    }
    const goToDashboardAdmin = () => {
        navigation.navigate('Dashboard Admin');
        console.log('Dashboard Admin Screen');
    }
    const goToManageDashboarUser = () => {
        navigation.navigate('Manage User Login');
        console.log('Manage User Login Screen');
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.dasar}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={goToDashboardAdmin}>
                        <FontAwesomeIcon icon={faArrowLeft} size={25} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Employee Management</Text>
                </View>
            </View>

            <View style={styles.contentWhite}>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth, {borderLeftColor:'#6759ff'}]} onPress={goToEmployees}>
                    <FontAwesomeIcon icon={faUsers} size={32} color="#6759ff" />
                    <Text style={[styles.menuText, {color:'#6759ff'}]}>Employees</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth , {borderLeftColor:'#6759ff'}]} onPress={goToManageDashboarUser}>
                    <FontAwesomeIcon icon={faUserCheck} size={32} color="#6759ff" />
                    <Text style={[styles.menuText, {color:'#6759ff'}]}>Manage User Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth, {borderLeftColor:'#6759ff'}]} onPress={goToEmployees}>
                    <FontAwesomeIcon icon={faAddressCard} size={32} color="#6759ff" />
                    <Text style={[styles.menuText, {color:'#6759ff'}]}>Position Jobs</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, styles.fullWidth, {borderLeftColor:'#6759ff'}]}>
                    <FontAwesomeIcon icon={faHistory} size={32} color="#6759ff" />
                    <Text style={[styles.menuText, {color:'#6759ff'}]}>Overtime Management</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.fullWidth, {borderLeftColor:'#6759ff'}]}>
                    <FontAwesomeIcon icon={faPersonBooth} size={32} color="#6759ff" />
                    <Text style={[styles.menuText, {color:'#6759ff'}]}>Leave Management</Text>
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
        paddingHorizontal: 30,
        paddingVertical: 30
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
});

export default DashboardEmployeeManagement;
