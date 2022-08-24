const React = require("react");
// import { ... } from  '@testing-library/react';
const userEvent = require('@testing-library/user-event');
const { Homepage } = require('../pages/Home');
const renderer = require('react-test-renderer')

it ("matches snapshot", () => {
    const tree = renderer
        .create(Homepage )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
