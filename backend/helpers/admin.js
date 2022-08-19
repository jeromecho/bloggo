// Code for accessing the one admin user
const User = require('../models/user');
require('dotenv').config();
const adminID = process.env.ADMIN_ID;

// module.exports must be an OBJECT
module.exports = {
    adminID,
};
