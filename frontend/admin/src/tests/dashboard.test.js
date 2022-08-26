const React = require("react");
// import { ... } from  '@testing-library/react';
const userEvent = require('@testing-library/user-event');
const { Dashboard } = require('../pages/Dashboard');
const renderer = require('react-test-renderer')

it ("matches snapshot", () => {
    const tree = renderer
        .create(Signup )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
