import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faFileInvoiceDollar, faUsers, faArrowLeft, faPersonWalkingArrowRight, faCalendarPlus, faArrowRight, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardAdminScreen = ({ navigation }) => {
  const [departmentCounts, setDepartmentCounts] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployeeCounts();
  }, []);

  const fetchEmployeeCounts = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/count/total', config);
      setDepartmentCounts(response.data);
    } catch (error) {
      console.error('Error fetching department counts:', error);
    }
  };

  const goToEmployeeManagement = () => {
    navigation.navigate('Employee Management');
  };

  const goToPayrollManagement = () => {
    navigation.navigate('Payroll Management');
  };

  const goToAbsenceManagement = () => {
    navigation.navigate('Absence Management');
  };

  const goToHome = () => {
    navigation.navigate('Home');
  };

  const renderDepartmentCounts = () => {
    return Object.keys(departmentCounts).map((department, index) => (
      <View key={index} style={styles.statusContainer}>
        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>{department}</Text>
          <Text style={styles.statusCount}>{departmentCounts[department]} people</Text>
        </View>
      </View>
    ));
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeResponse, positionResponse] = await Promise.all([
          axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=employees'),
          axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php?r=position-employees')
        ]);

        const employeesData = employeeResponse.data;
        const positionsData = positionResponse.data;

        const filteredEmployeesData = employeesData.filter(employee => employee.position_id !== 12);
        const updatedEmployees = filteredEmployeesData.map(employee => {
          const position = positionsData.find(pos => pos.id === employee.position_id);
          return {
            ...employee,
            position_name: position ? position.position_name : 'Unknown'
          };
        });

        setEmployees(updatedEmployees.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
          <Image source={require('../../assets/images/employee_management_v2.jpg')} style={styles.image} />
            <Text style={[styles.menuText, { color: "#6759ff" }]}>Employee Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={goToPayrollManagement}>
          <Image source={require('../../assets/images/payroll_management.jpg')} style={styles.image} />
            <Text style={[styles.menuText, { color: "#EC353A" }]}>Payroll Management</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.menuItem, styles.fullWidth, { borderColor: "#6759ff" }]} onPress={goToAbsenceManagement}>
          <View style={styles.absenceManagementContainer}>
            <Image source={require('../../assets/images/absence_management_v3.jpg')} style={styles.image} />
            <Text style={styles.absenceManagementText}>Absence Management</Text>
            <FontAwesomeIcon icon={faChevronRight} size={20} color="#6759ff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.fullWidth]}>
        <View style={styles.letterManagementContainer}>
            <Image source={require('../../assets/images/letter_management_v2.jpg')} style={styles.image} />
            <Text style={styles.letterManagementText}>Permission Letter Management</Text>
            <FontAwesomeIcon icon={faChevronRight} size={20} color="#EC353A" />
          </View>
        </TouchableOpacity>

        <ScrollView horizontal style={styles.containerStatus}>
          {renderDepartmentCounts()}
        </ScrollView>

        <View style={styles.employeesContainer}>
          <Text style={styles.employeesTitle}>Employees</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Employees')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.employeesList} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.employeeItem} onPress={() => navigation.navigate('Create Employee')}>
            <View style={styles.addNew}>
              <Text style={styles.addNewText}>+</Text>
            </View>
            <Text style={styles.employeeName}>Add new</Text>
          </TouchableOpacity>

          {employees.map((employee, index) => (
            <View key={index} style={styles.employeeItem}>
              <Image source={getRandomImage()} style={styles.employeeImage} />
              <Text style={styles.employeeName}>{employee.nama_depan} {employee.nama_belakang}</Text>
              <Text style={styles.employeeRole}>{employee.position_name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dasarRed: {
    backgroundColor: '#007BFF',
    height: 200,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 50,
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
    marginBottom: 10,
    marginTop: 10,
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
  absenceManagementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  absenceManagementText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },


  letterManagementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  letterManagementText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});

export default DashboardAdminScreen;
