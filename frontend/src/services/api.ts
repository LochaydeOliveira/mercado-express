import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = 'http://localhost/mercado_express/backend/routes/api.php';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfToken: string | null = null;

export const setCsrfToken = (token: string): void => {
  csrfToken = token;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.method !== 'get' && csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data;
    if (data && data.success && data.data?.csrf_token) {
      setCsrfToken(data.data.csrf_token);
    }
    return response;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      console.warn('Sessão expirada ou não autenticada.');
    }
    return Promise.reject(error);
  }
);