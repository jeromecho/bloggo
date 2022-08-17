const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("open", () =>{
    console.log(`Connected to database - ${process.env.MONGODB_URI}`);
});

db.once("error", err => {
    console.log(`Error connecting to database - ${err}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});


