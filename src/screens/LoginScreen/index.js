import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, Modal, Pressable, Button   } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import auth_api from '../../api/getAuth/index';
import SweetAlert from 'react-native-sweet-alert';
import NetInfo from '@react-native-community/netinfo';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faSearch  } from '@fortawesome/free-solid-svg-icons';
const LoginScreen = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const goChoose = () => {
    navigation.navigate('LoginOrRegister');
  };

  const showForgotPasswordModal = () => {
    setModalVisible(true);
  };

  const closeForgotPasswordModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>

        <Image
        source={require('../../assets/images/logo_djipay_v2.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.text}>Stay signed in with your account</Text>
      <View style={styles.loginContainer}>
        <Text style={styles.textUsername}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#949494"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <Text style={styles.textUsername}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#949494"

          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <View style={styles.optionsContainer}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={showPassword}
              onValueChange={setShowPassword}
            />
            <Text style={styles.checkboxText}>Show Password</Text>
          </View>
          <TouchableOpacity onPress={showForgotPasswordModal} >
            <Text style={styles.textForgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Sign In'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goChoose}>
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeForgotPasswordModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pemberitahuan</Text>
            <Text style={styles.modalDescription}>Jika lupa password, hubungi <Text style={{fontWeight:'bold'}}>General Manager</Text></Text>
            <TouchableOpacity onPress={closeForgotPasswordModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical:150
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
  loginContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textUsername: {
    fontSize: 15,
    marginBottom: 10,
    color: '#2c2c2c',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#a7a7a74b',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "#da4a4a",
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
  textForgot: {
    fontSize: 12,
    color: '#EC353A',
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
    backgroundColor: '#EC353A',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  jobdesLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  iconContainer: {
    marginRight: 10,
  },
  dji: {
    color: "#000",
    fontSize: 20,
    fontWeight: '900',
  },
  pay: {
    color: "#ec353a",
    fontSize: 20,
    fontWeight: '900',
  },

  logo: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain', 
  },

  backText: {
    color: '#EC353A',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 20,
  },

    // Modal styles
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalDescription: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    modalCloseButton: {
      backgroundColor: '#EC353A',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    modalCloseButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
});
