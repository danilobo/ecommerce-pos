// src/services/authService.ts
// Token fornecido
const FIXED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiZW1haWwiOiJ1c3VhcmlvQHRlc3RlLmNvbSIsInJvbGUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsicmVhZCIsIndyaXRlIl0sImlhdCI6MTc0OTkxMjMxMiwiZXhwIjoxNzQ5OTk4NzEyLCJhdWQiOiJteS1hcHAtdXNlcnMiLCJpc3MiOiJteS1hcHAiLCJzdWIiOiIxMjMifQ.mHr0c9yvyXzGeoY1wY4oskBKeKdZ2dA0DVBvjORmy_4";

// Função que é chamada durante a inicialização da aplicação para definir o token
export const initializeAuth = (): void => {
  localStorage.setItem('token', FIXED_TOKEN);
  console.log('Token inicializado e armazenado no localStorage');
};

// Simulação de login - agora apenas retorna o token fixo
export const login = async (): Promise<string> => {
  // Apenas para manter compatibilidade com o código existente
  localStorage.setItem('token', FIXED_TOKEN);
  return FIXED_TOKEN;
};

export const logout = (): void => {
  console.log('Logout chamado, mas o token não será removido');
};

export const getToken = (): string => {
  return localStorage.getItem('token') || FIXED_TOKEN;
};

export const isAuthenticated = (): boolean => {
  return true; // Sempre retorna true, já que o token fixo será sempre válido
};