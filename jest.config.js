module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.test.js"],
  moduleFileExtensions: ["js", "json"],
  setupFiles: ["<rootDir>/jest.setup.js"],
};
