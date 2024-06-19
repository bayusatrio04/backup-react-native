// ApiManager.js
import axios from 'axios';

const APIManager = axios.create({
  baseURL: 'https://basically-wanted-wombat.ngrok-free.app/rest-api-yii/api/web/index.php',
  responseType: 'json',
  withCredentials: true,
});

export default APIManager;
