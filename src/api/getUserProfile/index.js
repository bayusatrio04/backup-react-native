import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserProfile = () => {
  const [email, setEmail] = useState('');
  const [nama_depan, setNamaDepan] = useState('');
  
  const [nama_belakang, setNamaBelakang] = useState('');
  const [tanggal_lahir, setTanggalLahir] = useState('');
  const [jenis_kelamin, setJenisKelamin] = useState('');
  const [no_telepon, setNoTelepon] = useState('');
  const [position, setPosition] = useState('');
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Ambil access token dari AsyncStorage
        const token = await AsyncStorage.getItem('accessToken');

        if (token) {
          // Ambil data profil pengguna dari API menggunakan token
          const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/auth/profile', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setEmail(data.email);
          setNamaDepan(data.nama_depan);
          setNamaBelakang(data.nama_belakang);
          setTanggalLahir(data.tanggal_lahir);
          setJenisKelamin(data.jenis_kelamin);
          setNoTelepon(data.no_telepon);
          setPosition(data.position_id);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return { email, nama_depan, nama_belakang,tanggal_lahir, jenis_kelamin, no_telepon, position };
};

export default useUserProfile;
