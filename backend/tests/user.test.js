const request = require('supertest');
const express = require('express');
require('dotenv').config();
const userRouter = require('../routes/user');
const initializeMongoServer = require('../mongoconfigs/mongoConfigTest');
const PORT = process.env.TESTING_PORT || 4000;
const app = express();

describe('users', () => {
    beforeAll(() => {
        initializeMongoServer();
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use('/users', userRouter);
    });

    it ("signs up user", (done) => {
        request(app)
            .post(`/users/signup`)
            .type('form')
            .send({
                name: 'Dragonfly', 
                username: 'joewinston', 
                password: 'securepassword',
            })
            .expect('"Successfully signed up user Dragonfly"')
            .expect(200, done);
    });

    it ("logs in signed up user", (done) => {
        request(app)
            .post(`/users/signup`)
            .type('form')
            .send({
                name: 'johnson', 
                username: 'wilson', 
                password: 'securepassword',
            })
            .then(() => {
                request(app)
                    .post('/users/login/')
                    .type('form')
                    .send({
                        username: 'wilson', 
                        password: 'securepassword',
                    })
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(/.*\..*\..*/, done);
            });
    });

    it ("fails when trying to log in not signed up user", (done) => {
        request(app)
            .post('/users/login')
            .type('form')
            .send({
                username: 'invalid_credential', 
                password: 'invalid_credential',
            })
            .expect(res => {
                if (res === 200) { throw new Error('Did not fail') }
            })
            .end((err, res) => {
                if (err) { return done(err) }
                return done();
            });
    });
});
