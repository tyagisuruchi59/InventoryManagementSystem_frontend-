import axios from 'axios';

const getToken = () => localStorage.getItem('stockpro_token');

const createAPI = (baseURL) => {
  const instance = axios.create({ baseURL });
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );
  return instance;
};

export const authAPI = createAPI('http://localhost:5000');