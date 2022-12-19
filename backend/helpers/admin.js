// Code for accessing the one admin user
const User = require('../models/user');
require('dotenv').config();

const admin = {
    adminID: process.env.ADMIN_ID,
    get ID () {
        return this.adminID; 
    },
    set ID (id) {
        this.adminID = id;
    }, 
    update() {
        this.adminID = process.env.ADMIN_ID;
    }
}

// module.exports must be an OBJECT
module.exports = admin;
