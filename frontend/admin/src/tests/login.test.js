const React = require("react");
// import { ... } from  '@testing-library/react';
const userEvent = require('@testing-library/user-event');
const { Login } = require('../pages/Login');
const renderer = require('react-test-renderer')

it ("matches snapshot", () => {
    const tree = renderer
        .create(Login )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
