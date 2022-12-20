const React = require("react");
const userEvent = require('@testing-library/user-event');
const { Signup } = require('../pages/Signup');
const renderer = require('react-test-renderer')
const { MemoryRouter } = require('react-router-dom');

it ("matches snapshot", () => {
    const tree = renderer
        .create(<MemoryRouter><Signup /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
