const React = require("react");
const userEvent = require('@testing-library/user-event');
const { DeleteConfirm } = require('../pages/DeleteConfirm');
const renderer = require('react-test-renderer')
const { MemoryRouter } = require('react-router-dom');

it ("matches snapshot", () => {
    const tree = renderer
        .create(<MemoryRouter><DeleteConfirm /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
