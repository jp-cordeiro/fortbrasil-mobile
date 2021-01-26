import axios from 'axios';
import { API_URL } from '@env';
import SyncStorage from 'sync-storage';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = SyncStorage.get('token');
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
