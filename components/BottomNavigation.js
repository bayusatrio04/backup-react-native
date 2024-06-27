import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faCirclePlus, faCircleUser, faHouseUser, faXmark, faTimes } from '@fortawesome/free-solid-svg-icons';
import NetInfo from '@react-native-community/netinfo';
const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
import useUserProfile from '../src/api/getUserProfile/index';
const BottomNavigation = () => {

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activePage, setActivePage] = useState('Home');
  const [isConnected, setIsConnected] = useState(true);
  const isFocused = useIsFocused();
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

  const goToPage = (pageName) => {
    navigation.navigate(pageName);
    setActivePage(pageName);
  };




  

  const [dashboardON, setDashboardON] = useState(true);
 

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
  const goToHistoryLetters = () => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
    navigation.navigate('History Letters');
    console.log('History Letters Screen');
  };
  const buttonProfile = '#FF78C4';
  const buttonPayslip = '#E1AEFF';
  const buttonAll = '#e74c3c';
  const buttonCreateLetter = '#FFBDF7';
  const buttonSalaries = '#FFECEC';
  const buttonAttendance = '#E1AEFF';

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
    <View style={styles.nav}>
      <TouchableOpacity
        style={[styles.navItemContent]}
        onPress={() => goToPage('Home')}
      >
        <FontAwesomeIcon icon={faHouseUser} size={35} color="#900" />
      </TouchableOpacity>

      <View style={styles.circleButtonContainer}>
        <View style={[styles.navItemContent, styles.circleButton]}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>

          <FontAwesomeIcon icon={faCirclePlus} size={45} color="#900" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.navItemContent]}
        onPress={goToProfile}
      >
        <FontAwesomeIcon icon={faCircleUser} size={35} color="#900" />
      </TouchableOpacity>
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(!modalVisible)}>
          <FontAwesomeIcon icon={faTimes} size={30} color="#900" />
        </TouchableOpacity>

        {/* Baris 1 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, { backgroundColor: buttonProfile }]} onPress={goToProfile}>
            <Text style={styles.modalText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: buttonProfile }]} onPress={goToPayslip}>
            <Text style={styles.modalText}>PaySlip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: buttonPayslip }]} onPress={goToAllLetter}>
            <Text style={styles.modalText}>Create Letters</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: buttonPayslip }]} onPress={goToHistoryLetters}>
            <Text style={styles.modalText}>History Letters</Text>
          </TouchableOpacity>
        </View>

        {/* Baris 2 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, { backgroundColor: buttonPayslip }]}>
            <Text style={styles.modalText}>Salaries</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: buttonProfile }]}>
            <Text style={styles.modalText}>Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: buttonProfile }]}>
            <Text style={styles.modalText}>Cuti</Text>
          </TouchableOpacity>
        </View>

        {/* Baris 3 (Quick Access) */}
        <View style={styles.quickAccessContainer}>
          <Text style={styles.quickAccess}>Quick Access</Text>
        </View>
      </View>
    </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    // position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1, // Menambahkan garis atas
    borderTopColor: '#ccc', // Warna garis atas
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 20,
    borderRadius: 10,
  },
  circleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom:30
  },
  circleButton: {
    backgroundColor: 'white',
    borderRadius: 50, // Agar bentuknya lingkaran
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Efek naik untuk shadow (hanya untuk Android)
    shadowColor: '#000', // Warna shadow (hanya untuk iOS)
    shadowOffset: { width: 0, height: 2 }, // Offset shadow (hanya untuk iOS)
    shadowOpacity: 0.2, // Opasitas shadow (hanya untuk iOS)
    shadowRadius: 2, // Radius shadow (hanya untuk iOS)
  },

  modalView: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    marginBottom:20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  quickAccessContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    alignItems: 'center',
  },
  quickAccess: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default BottomNavigation;
