import axios from 'axios';

const ENV = 'development';

const api = axios.create({
  baseURL:
    import.meta.env.MODE === ENV
      ? 'http://localhost:3000/'
      : 'http://134.209.78.36/',
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
