import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert, Modal } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused  } from '@react-navigation/native';
import Tooltip from 'react-native-tooltip';
//Styling screen
import styles from './styles/index';

//Get Data from Api
import Attendance from "../../../components/Attendance";
import BottomNavigation from '../../../components/BottomNavigation'; 
import useUserProfile from '../../api/getUserProfile/index'; 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRightFromBracket, faBars, faBell, faFileLines, faFileSignature, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { email, nama_depan, position } = useUserProfile();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();



  const [dashboardON, setDashboardON] = useState(true);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      return "Good Morning,";
    } else if (hour >= 11 && hour < 17) {
      return "Good Afternoon,";
    } else if (hour >= 17 && hour < 20) {
      return "Good Evening,";
    } else {
      return "Good Night,";
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Alert.alert('No Internet Connection', 'Check your internet connection!');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const greeting = getGreeting();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const dataToken = await AsyncStorage.getItem('accessToken');
        if (!dataToken) {
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('LoginScreen');
      }
    };

    checkLoginStatus();
  }, [navigation]);
  useEffect(() => {
    // Reset modal status when focus back to Home screen
    if (isFocused) {
      setModalVisible(false);
    }
  }, [isFocused]);

  const handleLogout = async () => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
    try {
      // Menghapus accessToken dari AsyncStorage
      await AsyncStorage.removeItem('accessToken');

      // Mengecek apakah token masih ada
      const token = await AsyncStorage.getItem('accessToken');
      console.log(token);
      if (token === null) {
        console.log('Token berhasil dihapus!');
        console.log('Berhasil Logout !');
        navigation.replace('LoginScreen');
      } else {
        console.log('Token masih ada:', token);
      }
    } catch (error) {
      console.log('Error occurred while logging out:', error);
    }
  };
  goToDashboardAdmin = () =>{
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
    setModalVisible(false);
    navigation.navigate('Dashboard Admin');
    console.log('Dashboard Admin Screen');
  }
  const goToProfile = () => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
    setModalVisible(false);
    navigation.navigate('Profile');
    console.log('Profile Screen');
  };

  const goToHistorySalaries = () => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
    navigation.navigate('History Salaries');
    console.log('History Salaries Screen');
  };
  const buttonProfile = '#3498db'; 
  const buttonPayslip = '#2ecc71';
  const buttonAll = '#e74c3c'; 
  const buttonActivity = '#f39c12'; 
  const buttonSalaries = '#9b59b6'; 
  const buttonAttendance = '#34495e'; 
  const buttonDashboard = '#1abc9c'; 
  const goToPayslip = () => {
    if (!isConnected) {
        Alert.alert('No Internet Connection', 'Check your internet connection!');
        return;
      }
    navigation.navigate('PayslipScreen'); 
    console.log('PaySlip Screen')
};
const goToHistoryAttendance = () => {
  if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
  navigation.navigate('Attendance Summary'); 
  console.log('History Attendance Screen')
};
const goToAllLetter = () => {
  if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
  navigation.navigate('Letter Creation'); 
  console.log('Letter Creation Screen')
};
const goToOvertimeLetter = () => {
  if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
  navigation.navigate('Create Overtime Letter'); 
  console.log('Create Overtime Letter Screen')
};


  return (
    <View style={styles.homeEmployee}>
      <View style={styles.dasar}>
        <SafeAreaView style={styles.containerNav}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={faBars} size={30} color="#900" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <FontAwesomeIcon icon={faBell} size={25} color="#900" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} >
            <Image source={require('../../assets/images/avatar5.jpg')} style={styles.profileImage} />
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.textContainer}>
          <Text style={styles.goodAfternoon}>{greeting}</Text>
          <Text style={styles.namaLengkap}>Hi! {nama_depan}</Text>
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.attendanceContainer}>
          {position == 12 ? (
              <TouchableOpacity style={styles.buttonDashboard} onPress={goToDashboardAdmin}>
                <Text style={styles.modalText}>Dashboard Admin</Text>
              </TouchableOpacity>
            ) : (
              <Attendance loading={loading} setLoading={setLoading} />
            )}
          </View>
        </View>
      </View>
      {!isConnected && <Text style={styles.disconnected}>You are offline</Text>}
      <ScrollView>
        <View style={styles.MenuController}>
          <View style={styles.row}>
            <View style={styles.whiteBox}>
              <View style={styles.imageContainer}>
                <Image source={require('../../assets/images/history_of_attendance.png')} style={styles.image} />
              </View>
              <TouchableOpacity onPress={goToHistoryAttendance}>
                <Text style={styles.caption}>History of Attendance</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.whiteBox}>
              <View style={styles.imageContainer}>
                <Image source={require('../../assets/images/history_of_salaries.png')} style={styles.image} />
              </View>
              <TouchableOpacity onPress={goToHistorySalaries}>
                <Text style={styles.caption}>History of Salaries</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.redBox}>
              <View style={styles.boxTransparant} />
              <View style={styles.boxTransparant2} />
              <View style={{ position: 'absolute', left: 10, top: 30 }}>
                <View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faFileLines} size={20} color="#900" />
                </View>
                <TouchableOpacity onPress={goToOvertimeLetter}>
                  <Text style={styles.redBoxText}>Overtime Work Letter</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.redBox}>
              <View style={styles.boxTransparant} />
              <View style={styles.boxTransparant2} />
              <View style={{ position: 'absolute', left: 10, top: 30 }}>
                <View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} size={20} color="#900" />
                </View>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.redBoxText}>Logout Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(!modalVisible);
  }}
>
  <View style={styles.modalView}>
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => setModalVisible(!modalVisible)}
    >
 
      <FontAwesomeIcon icon={faXmark} size={30} color="#900" />
    </TouchableOpacity>
    
    {/* Baris 1 */}
    <View style={styles.buttonRow}>
      <TouchableOpacity style={[styles.button, { backgroundColor: buttonAll }]} onPress={goToProfile}>
        <Text style={styles.modalText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button,  { backgroundColor: buttonAll } ]} onPress={goToPayslip}>
        <Text style={styles.modalText}>PaySlip</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button,  { backgroundColor: buttonAll }]} onPress={goToAllLetter}>  
        <Text style={styles.modalText}>Create Letters</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: buttonAll } ]}>
        <Text style={styles.modalText}>History Letters</Text>
      </TouchableOpacity>
    </View>

    {/* Baris 2 */}
    <View style={styles.buttonRow}>
      <TouchableOpacity style={[styles.button,  { backgroundColor: buttonAll }]}>
        <Text style={styles.modalText}>Salaries</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: buttonAll }]}>
        <Text style={styles.modalText}>Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button,  { backgroundColor: buttonAll }]}>
        <Text style={styles.modalText}>Cuti</Text>
      </TouchableOpacity>

   
    </View>
    <View style={styles.buttonRow}>

     
        <Text style={styles.quickAccess}>Quick Access</Text>
  
    </View>
  </View>
</Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)}>

      <BottomNavigation />
      </TouchableOpacity>
    </View>
  );

}
