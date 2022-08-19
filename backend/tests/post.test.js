const request = require('supertest');
const express = require('express');
const initializeMongoServer = require('../mongoconfigs/mongoConfigTest');
const app = express();
const postRouter = require('../routes/post');
const userRouter = require('../routes/user');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const PORT = process.env.TESTING_PORT || 4000;

const adminID = require('../helpers/admin').adminID;
const User = require('../models/user');
const Post = require('../models/post');
let jwt;

describe('posts', () => {
    // beforeAll waits for a Promise to resolve IF it's a promise that 
    // the beforeAll RETURNS!
    beforeAll(() => {
        initializeMongoServer();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.use('/users', userRouter);
        app.use('/posts', postRouter);

        const admin = new User({
            _id: adminID,
            name: 'admin', 
            username: 'admin', 
            password: bcrypt.hashSync('adminpassword', 10),
        });
        const post_1 = new Post({
            name: 'Why I stopped showering',
            date_made: new Date(),
            is_published: false,
            content: 'It was my third day in India...',
            author: admin._id,
            comments: [],
        });
        const post_2 = new Post({
            name: 'Why I am arrogant but happy',
            date_made: new Date(),
            is_published: true,
            content: 'I am better than all of you...',
            author: admin._id,
            comments: [],
        });

        const adminPromise = new Promise((resolve, reject) => {
            admin.save(err => {
                if (err) { return console.log(err) }
                console.log('successfully saved user');

                request(app)
                    .post('/users/login')
                    .type('form')
                    .send({
                        username: 'admin', 
                        password: 'adminpassword',
                    }) 
                    .then(res => {
                        jwt = JSON.parse(res.text);
                        resolve('done');
                    });
            });
        });

        const post1Promise = new Promise((resolve, reject) => {
            post_1.save(err => {
                if (err) { return console.log(err) }
                console.log('successfully saved post');
                resolve('done');
            })
        });

        const post2Promise = new Promise((resolve, reject) => {
            post_2.save(err => {
                if (err) { return console.log(err) }
                console.log('successfully saved post');
                resolve('done');
            })
        });

        const promises = Promise.all([
            adminPromise, 
            post1Promise, 
            post2Promise
        ]);

        console.log(promises);
        return promises;
    });

    describe(`reads admin's posts`, () => {
        it ('user authenticated as admin gets all posts', (done) => {
            request(app)
                .get('/posts')
                .set('authorization', `bearer ${jwt}`)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect('Content-Length', '463')
                .end((err, res) => {
                    if (err) { return done(err) }
                    return done();
                });
        });
        
        it ('unauthenticated user gets only published posts', (done) => {
            request(app)
                .get('/posts/published_posts')
                .set('authorization', `bearer ${jwt}`)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect('Content-Length', '233', done);
        });

        it ('gets post detail', (done) => {
            done();
        });

        it ('does not get detail of nonexistent post', (done) => {
            done();
        });
    });

    describe('creates posts', () => {
        it ('works for authenticated user', (done) => {
            done();
        });

        it ('fails for not authenticated user', (done) => {
            done();
        });
    });

    describe('updates posts', () => {
        it ('works for authenticated user', (done) => {
            done();
        });

        it ('fails for not authenticated user', (done) => {
            done();
        });
    });

    describe('deletes posts', () => {
        it ('works for authenticated user', (done) => {
            done();
        });

        it ('fails for not authenticated user', (done) => {
            done();
        });
    });

});


