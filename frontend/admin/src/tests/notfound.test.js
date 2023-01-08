const React = require("react");
const { MemoryRouter } = require('react-router-dom');
const userEvent = require('@testing-library/user-event');
const { NotFound } = require('../pages/NotFound');
const renderer = require('react-test-renderer')

it ("matches snapshot", () => {
    const tree = renderer
        .create(<MemoryRouter><NotFound /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
