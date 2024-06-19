import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: 'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/frontend/web/index.php',
    timeout: 10000, // Adjust timeout as needed
});

// Function to retrieve token from AsyncStorage
const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        return token;
    } catch (error) {
        console.error('Error retrieving token from AsyncStorage:', error);
        throw error; // Handle error appropriately
    }
};

// Axios request interceptor to attach token to every request
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
