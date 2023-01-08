const React = require("react");
const userEvent = require('@testing-library/user-event');
const { AllPosts } = require('../pages/AllPosts');
const renderer = require('react-test-renderer');
const { MemoryRouter } = require('react-router-dom');

it ("matches snapshot", () => {
    console.log(<AllPosts />)
    const tree = renderer
        .create(<MemoryRouter><AllPosts /></MemoryRouter>)
        .toJSON();
    console.log(tree);
    expect(tree).toMatchSnapshot();
});
