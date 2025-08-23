// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  // Defina o arquivo de setup global que será executado ANTES de tudo
  setupFiles: ['<rootDir>/jest-setup.js'],
  // Este arquivo é executado após o ambiente de teste, mas antes dos testes
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/?(*.)+(test|spec).[jt]s?(x)'
  ],
  // Transforme também o pacote react-router e react-router-dom
  transformIgnorePatterns: [
    '/node_modules/(?!(react-router|react-router-dom)/)'
  ]
};