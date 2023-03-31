import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3333',
  baseURL: 'https://api-campaign-module.azurewebsites.net/',
  // withCredentials: true,
});

export default api;

