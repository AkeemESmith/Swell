module.exports = {
  verbose: true,
  runner: '@jest-runner/electron', // deprecated?
  testEnvironment: '@jest-runner/electron/environment',
  moduleNameMapper: {
    // "collectCoverage": true,
    electron: '<rootDir>/__mocks__/electronMock.js',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMocks.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/__tests__/utils/reduxTestingUtils.tsx',
  ],
  collectCoverage: true,
  coverageDirectory: './test/coverage/jest-coverage',
  coverageReporters: ['json', 'text', 'html'],
  resolver: null,
};
