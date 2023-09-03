module.exports = {
    collectCoverageFrom: [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts"
    ],
    coverageThreshold: {
      global: {
        statements: 80,
        branches: 80,
        functions: 95,
        lines: 80
      }
    },
    testEnvironment: "node",
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    preset: "react-native",
    testMatch: [
        "**/tests/**/*.test.ts"
    ],
  };