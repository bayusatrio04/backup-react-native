import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, Modal, Pressable, Button   } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import auth_api from '../../api/getAuth/index';
import SweetAlert from 'react-native-sweet-alert';
import NetInfo from '@react-native-community/netinfo';
const LoginScreen = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isKeepSignedIn, setIsKeepSignedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin = async () => {
    setIsLoading(true); // Set isLoading menjadi true saat proses login dimulai
  
    // Periksa apakah input username atau password kosong
    if (!username.trim() || !password.trim()) {
      // Tampilkan pesan kesalahan jika input kosong
      Alert.alert('Login Gagal', 'Username atau password tidak boleh kosong');
      setIsLoading(false); // Set isLoading menjadi false karena proses login selesai
      return;
    }
  
    try {
      const result = await auth_api({
        username: username.toLocaleLowerCase(),
        password: password,
      });
  
      if (result.status === 200) {
        console.log(result.data);
        await AsyncStorage.setItem('accessToken', result.data.access_token);
        // Tampilkan pesan sukses menggunakan SweetAlert
        SweetAlert.showAlertWithOptions({
          title: 'Messages',
          subTitle: 'Login Berhasil',
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#c71515',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'success',
          cancellable: true,
          subTitleStyle: {
            fontSize: 40
          }
        });
        navigation.replace('Home');
      } else {
        // Tampilkan pesan kesalahan jika login gagal
        SweetAlert.showAlertWithOptions({
          title: '',
          subTitle: 'Login Gagal',
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'error',
          cancellable: true,
          subTitleStyle: {
            fontSize: 40
          }
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false); // Set isLoading menjadi false setelah proses login selesai atau terjadi kesalahan
    }
  };



  return (
    <View style={styles.container}>
        <Image
        source={require('../../assets/images/logo_djipay_v2.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome Back !</Text>
      <Text style={styles.text}>Stay signed in with your account to make searching easier</Text>
      <Text  style={styles.textUsername}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#949494"
        value={username}
        onChangeText={text => setUsername(text)}
      />
       <Text  style={styles.textUsername}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#949494"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
         <View style={styles.optionsContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isKeepSignedIn}
                onValueChange={setIsKeepSignedIn}
              />
              <Text style={styles.checkboxText}>Keep me signed in</Text>
            </View>
            <TouchableOpacity >
              <Text style={styles.textForgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Sign In'}</Text>
          </TouchableOpacity>
      {/* <Button title="Show Alert" onPress={showAlert} /> */}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical:50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black'
  },
  text: {
    fontSize: 15,
    marginBottom: 20,
    color:'#989898',
    textAlign:'center',
    paddingHorizontal:60
  },
  textUsername: {
    fontSize: 15,
    marginBottom: 20,
    color:'#2c2c2c',
    alignSelf: 'flex-start', // Mengatur teks ke kiri
    textAlign: 'left',

  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#a7a7a74b',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color:"#da4a4a"
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    marginLeft: 8,
    color: '#2c2c2c',
  },
  button: {
    backgroundColor: '#EC353A',
    paddingVertical: 15,
    paddingHorizontal: 130,
    borderRadius: 8,
    marginTop:20
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
    textForgot: {
    
    fontSize: 12,
    color: '#EC353A',
    fontWeight: 'relgular',
    alignSelf:'flex-end',
    bottom:5,
    textDecorationLine:'underline'
  },

  logo: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain', 
  },

  
});
