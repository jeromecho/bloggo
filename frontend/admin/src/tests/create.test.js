const React = require("react");
const userEvent = require('@testing-library/user-event');
const { CreatePost } = require('../pages/CreatePost');
const renderer = require('react-test-renderer')
const { MemoryRouter } = require('react-router-dom');
const { Editor } = require('@tinymce/tinymce-react');

it ("matches snapshot", () => {
    const tree = renderer
        .create(<MemoryRouter><CreatePost /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
