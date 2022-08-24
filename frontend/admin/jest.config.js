module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
    '^.+\\.(css|scss|png|jpg|svg)$': "jest-transform-stub"
  }
};
