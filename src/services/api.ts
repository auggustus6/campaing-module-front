import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:3333/'
      : 'https://api-campaign-module.azurewebsites.net/',
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('@campaign:token');

      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default api;
