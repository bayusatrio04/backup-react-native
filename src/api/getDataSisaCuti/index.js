import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getDataSisaCutiTahunan = () => {
  const [id, setId] = useState('');
  const [employee_id, setEmployeeId] = useState('');

  const [year, setYear] = useState('');
  const [total_leave_days, setTotalLeaveDays] = useState('');
  const [used_leave_days, setUsedLeaveDays] = useState('');
  const [remaining_leave_days, setRemainingLeaveDays] = useState('');

  useEffect(() => {
    const fetchSisaCuti = async () => {
      try {
        // Ambil access token dari AsyncStorage
        const token = await AsyncStorage.getItem('accessToken');

        if (token) {
          // Ambil data profil pengguna dari API menggunakan token
          const response = await fetch('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/absence/sisa-cuti-year/get-data-sisa-cuti', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
        //   console.log()
          setId(data.data.id);
          setEmployeeId(data.data.employee_id);
          setYear(data.data.year);
          setTotalLeaveDays(data.data.total_leave_days);
          setUsedLeaveDays(data.data.used_leave_days);
          setRemainingLeaveDays(data.data.remaining_leave_days);
   
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchSisaCuti();
  }, []);

  return { id, employee_id, year, total_leave_days, used_leave_days, remaining_leave_days };
};

export default getDataSisaCutiTahunan;
