import React,{useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowRightFromBracket, faChevronCircleRight, faChevronLeft, faChevronRight, faFileLines, faGear, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/index';
// Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserProfile from '../../api/getUserProfile/index';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
const ProfileScreen = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState(true);
    const { position}  = useUserProfile(); 
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
  
   

    const goToEditProfile= () => {
        if (!isConnected) {
            Alert.alert('No Internet Connection', 'Check your internet connection!');
            return;
          }
        navigation.navigate('Edit Profile'); 
        console.log('Edit Profile Screen')
    };

    const BackToHome = () => {
        if (!isConnected) {
            Alert.alert('No Internet Connection', 'Check your internet connection!');
            return;
          }
        navigation.navigate('Home'); 
        console.log('Home Screen')
    };

    
    return (
        <View style={styles.container}>
      
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.profileButton} onPress={BackToHome}>
                    <FontAwesomeIcon icon={faChevronLeft} size={20} color="#020202" />
                    <Text style={styles.headerTextProfile}>Profile</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.headerTextLogout}>Logout</Text>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} size={20} color="#EC353A" />
                </TouchableOpacity>
            </View>

            {/* Image Circle */}
            <View style={styles.imageContainer}>    
                <Image source={require('../../assets/images/avatar5.jpg')} style={styles.image} />
            </View>
       
            <View style={styles.boxProfile} />
            
            <View style={styles.profileInfo}>
            <Text style={styles.infoText}>Full Time</Text>
                <View style={styles.infoSeparator}></View> 
            <Text style={styles.infoText}>{position}</Text>  
            </View>
           
            <View style={styles.boxInfoValues}>
                <View style={styles.infoValues}>
                    <View style={styles.infoLabelContainer}>
                        <Text style={styles.infoLabelText}>Overtime</Text>
                        <Text style={styles.valueText}>20</Text>
                    </View>
                    <View style={styles.infoLabelContainer}>
                        <Text style={styles.infoLabelText}>Attendance</Text>
                        <Text style={styles.valueText}>20</Text>
                    </View>
                    <View style={styles.infoLabelContainer}>
                        <Text style={styles.infoLabelText}>TimeOff</Text>
                        <Text style={styles.valueText}>20</Text>
                    </View>
                </View>
            </View>
            <View style={styles.menuProfileContainer}>

                <TouchableOpacity  style={styles.menuContainer}>
                    <View style={[
                        styles.iconMenu,
                        { alignSelf: 'center', borderRadius: 100, backgroundColor: '#6190ff2a', width: 50, height: 50 }
                        ]}>
                        <FontAwesomeIcon icon={faUnlockKeyhole} size={20} color="#000000" />
                    </View>
                    <View style={styles.textMenu}>
                        <Text style={[styles.textMenu, {right:0}]}>Change Password</Text>
                    </View>
                    <View style={[styles.iconMenu]}>
                        <FontAwesomeIcon icon={faChevronRight} size={15} color="#020202" style={styles.iconMenu} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToEditProfile} style={styles.menuContainer}>
                    <View style={[
                        styles.iconMenu,
                        { alignSelf: 'center', borderRadius: 100, backgroundColor: '#eaff612a', width: 50, height: 50 }
                        ]}>
                        <FontAwesomeIcon icon={faGear} size={20} color="#000000" />
                    </View>
                    <View style={styles.textMenu}>
                        <Text style={[styles.textMenu, {right:25}]}>Edit Profile</Text>
                    </View>
                    <View style={[styles.iconMenu]}>
                        <FontAwesomeIcon icon={faChevronRight} size={15} color="#020202" style={styles.iconMenu} />
                    </View>
                </TouchableOpacity>
                
            </View>
            

        </View>
    );
};






export default ProfileScreen;
