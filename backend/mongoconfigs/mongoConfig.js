const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("open", () =>{
    console.log(`Connected to database - ${process.env.MONGODB_URI}`);
});

db.once("error", err => {
    console.log(`Error connecting to database - ${err}`);
});
