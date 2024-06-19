import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCirclePlus, faCircleUser, faHouseUser } from '@fortawesome/free-solid-svg-icons';
import NetInfo from '@react-native-community/netinfo';
const BottomNavigation = () => {
  const navigation = useNavigation();
  const [activePage, setActivePage] = useState('Home');
  const [isConnected, setIsConnected] = useState(true);
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
  const goToProfile = () => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Check your internet connection!');
      return;
    }
 
    navigation.navigate('Profile');
    console.log('Profile Screen');
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
          <FontAwesomeIcon icon={faCirclePlus} size={45} color="#900" />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.navItemContent]}
        onPress={goToProfile}
      >
        <FontAwesomeIcon icon={faCircleUser} size={35} color="#900" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
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
    padding: 20,
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
});

export default BottomNavigation;
