import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3333',
  baseURL: 'https://api-campaign.onrender.com/',
  // withCredentials: true,
});

export default api;
