// StockPro Inventory Management System
// Frontend: API Configuration
// Developer: Suru | April 2026
// Description: Axios instances for all 8 microservices

import axios from 'axios';

const getToken = () => localStorage.getItem('stockpro_token');

const createAPI = (baseURL) => {
  const instance = axios.create({ baseURL });
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
};

export const authAPI      = createAPI('http://localhost:5000');
export const productAPI   = createAPI('http://localhost:5001');
export const warehouseAPI = createAPI('http://localhost:5002');
export const purchaseAPI  = createAPI('http://localhost:5004');
export const supplierAPI  = createAPI('http://localhost:5005');
export const movementAPI  = createAPI('http://localhost:5006');
export const alertAPI     = createAPI('http://localhost:5007');
export const reportAPI    = createAPI('http://localhost:5008');