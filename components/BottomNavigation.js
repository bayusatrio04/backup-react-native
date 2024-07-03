import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Dimensions, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faCirclePlus, faCircleUser, faHouseUser, faXmark, faTimes } from '@fortawesome/free-solid-svg-icons';
import NetInfo from '@react-native-community/netinfo';
const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
import useUserProfile from '../src/api/getUserProfile/index';
const BottomNavigation = ({modalVisible, setModalVisible}) => {

  const navigation = useNavigation();
  // const [modalVisible, setModalVisible] = useState(false);
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
  const goToAllAttendance = () => {
    if (!isConnected) {
        Alert.alert('No Internet Connection', 'Check your internet connection!');
        return;
      }
    navigation.navigate('Month Attendance History'); 
    console.log('Month Attendance History Screen')
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
const Card = ({ title, backgroundColor, icon, onPress }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress}>
    <Image source={icon} style={styles.cardIcon} />
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);
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
          <FontAwesomeIcon icon={faTimes} size={30} color="#333" />
        </TouchableOpacity>

        <View style={styles.row}>
          <Card title="Profile" backgroundColor="#FFCCCC" icon={require('../src/assets/images/profile.png')} onPress={goToProfile} />
          <Card title="PaySlip" backgroundColor="#CCFFCC" icon={require('../src/assets/images/payslip_v2.png')} onPress={goToPayslip} />
        </View>
        
        <View style={styles.row}>
          <Card title="Create Letters" backgroundColor="#CCCCFF" icon={require('../src/assets/images/overtime_v1.png')} onPress={goToAllLetter} />
          <Card title="History Letters" backgroundColor="#FFFFCC" icon={require('../src/assets/images/history.png')} onPress={goToHistoryLetters} />
        </View>

        <View style={styles.row}>
          <Card title="Attendance" backgroundColor="#FFCCFF" icon={require('../src/assets/images/history_attendance_v1.png')} onPress={goToAllAttendance} />
          <Card title="Cuti" backgroundColor="#FFCCCC" icon={require('../src/assets/images/cuti_v2.png')} />
        </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  card: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cardIcon: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#333f'
  },
  quickAccessContainer: {
    marginTop: 20,
  },
  quickAccess: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default BottomNavigation;
