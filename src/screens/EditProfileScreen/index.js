import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Button, Alert, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SweetAlert from 'react-native-sweet-alert';
const EditProfileScreen = ({ navigation }) => {
    const [selectedGender, setSelectedGender] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const genderOptions = [
        { label: 'Male', value: 'Laki-Laki' },
        { label: 'Female', value: 'Perempuan' },
    ];

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios.get('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data;
            setFirstName(userData.nama_depan);
            setLastName(userData.nama_belakang);
            setBirthDate(userData.tanggal_lahir);
            setPhone(userData.no_telepon.toString());
            // Periksa apakah jenis kelamin sudah ada dalam data pengguna
            if (userData.jenis_kelamin) {
                setSelectedGender(userData.jenis_kelamin);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios.put(
                'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/auth/profile/update',
                {
                    nama_depan: firstName,
                    nama_belakang: lastName,
                    tanggal_lahir: birthDate,
                    no_telepon: phone,
                    jenis_kelamin: selectedGender,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            SweetAlert.showAlertWithOptions({
                title: 'Success',
                subTitle: 'Profile updated successfully',
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
              navigation.replace('Profile');
            // Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again later.');
        }
    };
    const handlePhoneChange = (text) => {
        if (/^\d*$/.test(text)) {
            setPhone(text);
        } else {
            Alert.alert('Invalid Input', 'Hanya Boleh Angka saja!');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                    <FontAwesomeIcon icon={faChevronLeft} size={20} color="#020202" />
                    <Text style={styles.headerTextProfile}>Profile</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>

            <View style={styles.imageContainer}>    
                <Image source={require('../../assets/images/avatar5.jpg')} style={styles.image} />
                <View style={styles.iconContainer}>
                    <FontAwesomeIcon icon={faPenToSquare} size={20} color="#fff" />
                </View>
                <Text>Edit Image</Text>
            </View>

            <ScrollView>
                <View style={styles.menuProfileContainer}>
                    <Text style={styles.textInput}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your First Name"
                        placeholderTextColor="#949494"
                        value={firstName}
                        onChangeText={setFirstName}
                    />  
                    <Text style={styles.textInput}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Last Name"
                        placeholderTextColor="#949494"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    <Text style={styles.textInput}>Choose Gender</Text>
                    {genderOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles.radioButtonContainer}
                            onPress={() => setSelectedGender(option.value)}
                        >
                            <View style={styles.radioButton}>
                                {selectedGender === option.value && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.radioButtonLabel}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={styles.textInput}>Birthday Date <Text style={{ color:'red' }}>{`(2000-01-20)`}</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Birthday"
                        placeholderTextColor="#949494"
                        value={birthDate}
                        onChangeText={setBirthDate}
                    />
                    <Text style={styles.textInput}>No Telepon</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Telepon "
                        placeholderTextColor="#949494"
                        value={phone}
                        onChangeText={handlePhoneChange}
                    />

                    <View style={{ marginBottom: 20, marginTop:20 }}>
                        <Button title='Save Profile' color={'#EC353A'} onPress={handleSaveProfile} />
                    </View>
                    <Button title='Cancel' color={'#6fb2e9'} onPress={() => navigation.navigate('Profile')} />
                </View>
            </ScrollView>

        </View>
    );
};

export default EditProfileScreen;
