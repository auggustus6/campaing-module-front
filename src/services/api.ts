import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'https://134.209.78.36/'
      : 'https://134.209.78.36/',
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
