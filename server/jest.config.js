export default {
    transform: {
      "^.+\\.js$": "babel-jest"
    },
    testEnvironment: "node",
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js"
    }
  };
  