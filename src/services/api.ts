import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:3333/'
      : 'https://api-campaign-module.azurewebsites.net/',
  // withCredentials: true,
});

export default api;
