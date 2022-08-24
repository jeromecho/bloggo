const React = require("react");
// import { ... } from  '@testing-library/react';
const userEvent = require('@testing-library/user-event');
const { Post } = require('../pages/Post');
const renderer = require('react-test-renderer')

it ("matches snapshot", () => {
    const tree = renderer
        .create(Post)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
