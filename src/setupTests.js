// src/setupTests.js
require('@testing-library/jest-dom');

// Mock para localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Configurar timers falsos para testes de debounce
jest.useFakeTimers();