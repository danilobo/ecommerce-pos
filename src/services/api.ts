// src/services/api.ts
import axios from 'axios';
import { getToken } from './authService';

// Defina a URL base da sua API
const API_BASE_URL = 'http://127.0.0.1:3003';

// Criando instância do axios com configurações básicas
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(config => {
  // Sempre usa o token, não precisamos verificar se ele existe
  const token = getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;