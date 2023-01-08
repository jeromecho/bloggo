const React = require("react");
const userEvent = require('@testing-library/user-event');
const { Login } = require('../pages/Login');
const renderer = require('react-test-renderer')
const { MemoryRouter } = require('react-router-dom');

it ("matches snapshot", () => {
    const tree = renderer
        .create(<MemoryRouter><Login /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
