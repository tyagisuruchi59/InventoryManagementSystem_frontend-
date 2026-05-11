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

export const authAPI = createAPI(
  process.env.REACT_APP_AUTH_URL 
);

export const productAPI = createAPI(
  process.env.REACT_APP_PRODUCT_URL 
);

export const warehouseAPI = createAPI(
  process.env.REACT_APP_WAREHOUSE_URL
);

export const purchaseAPI = createAPI(
  process.env.REACT_APP_PURCHASE_URL
);

export const supplierAPI = createAPI(
  process.env.REACT_APP_SUPPLIER_URL 
);

export const movementAPI = createAPI(
  process.env.REACT_APP_MOVEMENT_URL 
);

export const alertAPI = createAPI(
  process.env.REACT_APP_ALERT_URL
);

export const reportAPI = createAPI(
  process.env.REACT_APP_REPORT_URL 
);