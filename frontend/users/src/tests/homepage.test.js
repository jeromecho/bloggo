const React = require("react");
// import { ... } from  '@testing-library/react';
const userEvent = require('@testing-library/user-event');
const { Home } = require('../pages/Home');
const renderer = require('react-test-renderer')
const { MemoryRouter } = require('react-router-dom');

it ("matches snapshot", () => {
    const tree = renderer
        .create(<MemoryRouter><Home /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
