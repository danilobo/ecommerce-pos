// src/services/api.ts
import axios from 'axios';
import { getToken } from './authService';

// Defina a URL base da sua API
const API_BASE_URL = 'http://127.0.0.1:3003';
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ1c3VhcmlvQHRlc3RlLmNvbSIsInJvbGUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsicmVhZCIsIndyaXRlIl0sImlhdCI6MTc0OTkxMjMxMiwiZXhwIjoxNzQ5OTk4NzEyLCJhdWQiOiJteS1hcHAtdXNlcnMiLCJpc3MiOiJteS1hcHAiLCJzdWIiOiIxMjMifQ.mHr0c9yvyXzGeoY1wY4oskBKeKdZ2dA0DVBvjORmy_4";

// Criando instância do axios com configurações básicas
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
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