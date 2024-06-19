import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faFileInvoiceDollar, faUsers, faBars, faArrowLeft, faHistory, faPersonBooth } from '@fortawesome/free-solid-svg-icons';

const DashboardAdminScreen = ({ navigation }) => {

  const goToEmployeeManagement = () => {
    navigation.navigate('Employee Management');
    console.log('Employee Management Screen');
  }
  const goToHome = () => {
    navigation.navigate('Home');
    console.log('Home Screen');
  }
    const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Text style={styles.department}>{item.department}</Text>
      <Text style={styles.count}>{item.count} people</Text>
    </View>
  );
  const totalEmployees = [
    { department: 'Admin Penjualan', count: 2 },
    { department: 'General Manager', count: 2 },
    { department: 'Produksi', count: 7 },
    { department: 'Design Grafis', count: 5 },
    { department: 'Editor', count: 2 },
    { department: 'Lapangan', count: 5 },
    { department: 'Keuangan', count: 2 },
    { department: 'Media Social', count: 5 },
    { department: 'Penjualan', count: 5 },
    { department: 'Team Leader', count: 5 },
  ];
  const images = [
    require('../../assets/images/avatar/avatar-1.jpg'),
    require('../../assets/images/avatar/avatar-2.jpg'),
    require('../../assets/images/avatar/avatar-3.jpg'),
    require('../../assets/images/avatar/avatar-4.jpg'),
    require('../../assets/images/avatar/avatar-5.jpg'),
    require('../../assets/images/avatar/avatar-6.jpg'),
    require('../../assets/images/avatar/img-avatar-1.jpg'),
    require('../../assets/images/avatar/img-avatar-2.jpg'),
    require('../../assets/images/avatar/img-avatar-3.jpg'),
  ];
  
  const employees = [
    { name: 'Janine', role: 'UX Designer' },
    { name: 'Gloria', role: 'QA Tester' },
    { name: 'Mark', role: 'DevOps' },
    { name: 'Mark', role: 'DevOps' },
    { name: 'Mark', role: 'DevOps' },
  ];
  
  const getRandomImage = () => {
    return images[Math.floor(Math.random() * images.length)];
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dasarRed}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={goToHome}>
            <FontAwesomeIcon icon={faArrowLeft} size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Dashboard Admin</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <FontAwesomeIcon icon={faBell} size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentWhite}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.menuItem, { borderColor: "#6759ff" }]} onPress={goToEmployeeManagement}>
            <FontAwesomeIcon icon={faUsers} size={32} color="#6759ff" />
            <Text style={[styles.menuText, { color: "#6759ff" }]}>Employee Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} size={32} color="#EC353A" />
            <Text style={[styles.menuText, { color: "#EC353A" }]}>Payroll Management</Text>
          </TouchableOpacity>
        </View>
        <Text>Quick Access</Text>

        <TouchableOpacity style={[styles.menuItem, styles.fullWidth, { borderColor: "#6759ff" }]}>
  
          <Text style={styles.menuText}>      
            <FontAwesomeIcon icon={faHistory} size={32} color="#6759ff" />
            Overtime Management
            </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.fullWidth]}>
          <Text style={styles.menuText}>
          <FontAwesomeIcon icon={faPersonBooth} size={32} color="#EC353A" style={{ left:30 }} />
            Leave Management</Text>
        </TouchableOpacity>

        <ScrollView horizontal style={styles.containerStatus}>
          <View style={styles.statusContainer}>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Total Employee</Text>
              <Text style={styles.statusCount}>40 people</Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>General Manager</Text>
              <Text style={styles.statusCount}>2 people</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Produksi</Text>
              <Text style={styles.statusCount}>7 people</Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Design Grafis</Text>
              <Text style={styles.statusCount}>5 people</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Editor</Text>
              <Text style={styles.statusCount}>2 people</Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Lapangan</Text>
              <Text style={styles.statusCount}>5 people</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Keuangan</Text>
              <Text style={styles.statusCount}>2 people</Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Media Social</Text>
              <Text style={styles.statusCount}>5 people</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Penjualan</Text>
              <Text style={styles.statusCount}>5 people</Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Team Leader</Text>
              <Text style={styles.statusCount}>5 people</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Admin Penjualan</Text>
              <Text style={styles.statusCount}>2 people</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.employeesContainer}>
          <Text style={styles.employeesTitle}>Employees</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddEmployee')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.employeesList} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.employeeItem} onPress={() => navigation.navigate('AddEmployee')}>
            <View style={styles.addNew}>
              <Text style={styles.addNewText}>+</Text>
            </View>
            <Text style={styles.employeeName}>Add new</Text>
          </TouchableOpacity>
          {employees.map((employee, index) => (
            <View key={index} style={styles.employeeItem}>
              <Image source={getRandomImage()} style={styles.employeeImage} />
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeeRole}>{employee.role}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dasarRed: {
    backgroundColor: '#EC353A',
    height: 200,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  contentWhite: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    marginTop: -90,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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
    flex: 1,
    borderLeftWidth: 1.5,
    borderLeftColor: '#EC353A',
    backgroundColor: '#fff',
    padding: 20,
    margin: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fullWidth: {
    margin: 8,
  },
  menuText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  containerStatus: {
    flex: 1,
    backgroundColor: '#f5f5f5e8',
    padding: 10,
    marginBottom:10,
    marginTop:10
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statusBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusCount: {
    fontSize: 14,
    color: '#666',
  },
  employeesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  employeesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 16,
    color: '#007BFF',
  },
  employeesList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeItem: {
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 20,
  },
  addNew: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewText: {
    fontSize: 24,
    color: '#fff',
  },
  employeeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeRole: {
    fontSize: 14,
    color: '#666',
  },
});

export default DashboardAdminScreen;
