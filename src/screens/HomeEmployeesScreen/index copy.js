import React, { useState, useEffect , useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, RefreshControl, DrawerLayoutAndroid, Button  } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';


//Styling screen
import styles from './styles/index';

//Get Data from Api
// import Attendance from "../../../components/Attendance";
// import BottomNavigation from '../../../components/BottomNavigation'; 
// import useUserProfile from '../../api/getUserProfile/index'; 


export default function HomeScreen({ navigation }) {


  const [refreshing, setRefreshing] = useState(false);
  // const { email, nama_depan } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
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

  
  const handleLogout = async () => {
    try {
      // Menghapus accessToken dari AsyncStorage
      await AsyncStorage.removeItem('accessToken');
      console.log('Berhasil Logout !')
      navigation.replace('LoginScreen');
    } catch (error) {
      console.log('Error occurred while logging out:', error);
    }
  };

  const [account, setAccount] = useState('1');

  return (

    <ScrollView
     
    >
    <View style={styles.homeEmployee}>
      <View style={styles.dasar}>
        <SafeAreaView style={styles.containerNav}>
          <TouchableOpacity style={styles.menuButton}>
     
          <SvgUri
    width="30"
    height="30"
    uri={require('../../assets/icon/svg/fi-rr-home.svg')}
  />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>

          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Image source={require('../../assets/images/avatar5.jpg')} style={styles.profileImage} />
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.textContainer}>
          <Text style={styles.goodAfternoon}>Good Afternoon,</Text>
          {/* <Text style={styles.namaLengkap}>Hi! {nama_depan}</Text> */}
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.attendanceContainer}>
            {/* <Attendance /> */}
          </View>
        </View>
      </View>

      {/* MENU CONTROLLER */}
      <View style={styles.MenuController}>
        <View style={styles.row}>
          <View style={styles.whiteBox}>
            <View style={styles.imageContainer}>
              <Image source={require('../../assets/images/history_of_attendance.png')} style={styles.image} />
            </View>
            <TouchableOpacity>
              <Text style={styles.caption}>History of Attendance</Text>        
            </TouchableOpacity>
          </View>
  
          <View style={styles.whiteBox}>
            <View style={styles.imageContainer}>
              <Image source={require('../../assets/images/history_of_salaries.png')} style={styles.image} />
            </View>
            <Text style={styles.caption}>History of Salaries</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.redBox}>
            <View style={styles.boxTransparant} />
            <View style={styles.boxTransparant2} />
            <View style={{ position: 'absolute', left: 10, top: 30 }}>
<View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/icon/letter_icon.png')} style={styles.icon} />
              </View>
              <Text style={styles.redBoxText}>Overtime Work Letter</Text>
            </View>
          </View>
          <View style={styles.redBox}>
            <View style={styles.boxTransparant} />
            <View style={styles.boxTransparant2} />
            <View style={{ position: 'absolute', left: 10, top: 30 }}>
<View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/icon/logout_icon.png')} style={styles.icon} />
              </View>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.redBoxText}>Logout Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* MENU CONTROLLER */}
      {/* <BottomNavigation /> */}


    </View>
    
    </ScrollView>
    
  );
}
