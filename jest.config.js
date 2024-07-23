module.exports = {
  testEnvironment: 'jest-environment-jsdom', // Adicione esta linha
  testMatch: ['<rootDir>/src/__tests__/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
