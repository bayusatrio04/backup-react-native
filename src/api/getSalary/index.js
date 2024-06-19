import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getSalary = async (selectedMonth, selectedYear) => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.post('https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php/salary/salary-calculate-by-token/filter', {
            selectedMonth,
            selectedYear
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching salary data:', error);
        throw error;
    }
};

export default getSalary;
