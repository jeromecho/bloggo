const React = require("react");
const userEvent = require('@testing-library/user-event');
const { Dashboard } = require('../pages/Dashboard');
const renderer = require('react-test-renderer')
const { MemoryRouter } = require('react-router-dom');

it ("matches snapshot", () => {
    const tree = renderer
        .create(<MemoryRouter><Dashboard /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
