const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const admin = require('./helpers/admin');
require("dotenv").config();
require('./mongoconfigs/mongoConfig');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});



