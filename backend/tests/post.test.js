const request = require('supertest');
const express = require('express');
const initializeMongoServer = require('../mongoconfigs/mongoConfigTest');
const app = express();
const postRouter = require('../routes/post');
const userRouter = require('../routes/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

require('dotenv').config();
const PORT = process.env.TESTING_PORT || 4000;

const adminUser = require('../helpers/admin');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
let jwt;
const POST1ID = new mongoose.Types.ObjectId().toString();
const POST2ID = new mongoose.Types.ObjectId().toString();
const ADMINID = new mongoose.Types.ObjectId().toString();
const NONADMINID = new mongoose.Types.ObjectId().toString();
const COMMENT1ID = new mongoose.Types.ObjectId().toString();
const COMMENT2ID = new mongoose.Types.ObjectId().toString();

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
            _id: ADMINID,
            name: 'admin', 
            username: 'admin', 
            password: bcrypt.hashSync('adminpassword', 10),
        });
        const comment_1 = new Comment({
            _id: COMMENT1ID,
            author: 'George Cho', 
            email: 'georgecho@gmail.com',
            date_made: new Date(), 
            content: 'THIS IS REALLY DOPE. Seriously, we should talk sometime',
        });
        const comment_2 = new Comment({
            _id: COMMENT2ID,
            author: 'Joji Morikawa', 
            email: 'jojichi@gmail.com',
            date_made: new Date(), 
            content: 'OG Joji here. Check out my paper on the Cardinal Codes.',
        });
        const comment_3 = new Comment({
            author: 'Annabelle Moshikawa', 
            email: 'annabellemoshikawa@gmail.com',
            date_made: new Date(), 
            content: 'A comment for post 2',
        });
        const post_1 = new Post({
            _id: POST1ID,
            name: 'Why I stopped showering',
            date_made: new Date(),
            is_published: false,
            content: 'It was my third day in India...',
            author: admin._id,
            comments: [ comment_1._id ],
        });
        const post_2 = new Post({
            _id: POST2ID,
            name: 'Why I am arrogant but happy',
            date_made: new Date(),
            is_published: true,
            content: 'I am better than all of you...',
            author: admin._id,
            comments: [ comment_2._id ],
        });

        const nonadmin = new User({
            _id: NONADMINID,
            name: 'nonadmin', 
            username: 'nonadmin', 
            password: bcrypt.hashSync('nonadminpassword', 10),
        });

        const post_3 = new Post({
            name: 'Why I am lucky to be alive',
            date_made: new Date(),
            is_published: false,
            content: 'A near-death experience is said to be very colorful...',
            author: nonadmin._id,
            comments: [],
        });
        const post_4 = new Post({
            name: 'Why I fight bears',
            date_made: new Date(),
            is_published: true,
            content: 'My mother was Russian...',
            author: nonadmin._id,
            comments: [],
        });

        const adminPromise = new Promise((resolve, reject) => {
            admin.save(err => {
                if (err) { return reject(err) }
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
        const comment1Promise = new Promise((resolve, reject) => {
            comment_1.save(err => {
                if (err) { return reject(err) }
                console.log('saved comment');
                resolve('done');
            });
        });
        const comment2Promise = new Promise((resolve, reject) => {
            comment_2.save(err => {
                if (err) { return reject(err) }
                console.log('saved comment');
                resolve('done');
            });
        });
        const comment3Promise = new Promise((resolve, reject) => {
            comment_3.save(err => {
                if (err) { return reject(err) }
                console.log('saved comment');
                resolve('done');
            });
        });
        const post1Promise = new Promise((resolve, reject) => {
            post_1.save(err => {
                if (err) { return reject(err) }
                console.log('successfully saved post');
                resolve('done');
            })
        });
        const post2Promise = new Promise((resolve, reject) => {
            post_2.save(err => {
                if (err) { return reject(err) }
                console.log('successfully saved post');
                resolve('done');
            })
        });

        const nonadminPromise = new Promise((resolve, reject) => {
            nonadmin.save(err => {
                if (err) { return reject(err) }
                console.log('successfully saved user');
                resolve('done');
            });
        });

        const post3Promise = new Promise((resolve, reject) => {
            post_3.save(err => {
                if (err) { return reject(err) }
                console.log('successfully saved post');
                resolve('done');
            })
        });

        const post4Promise = new Promise((resolve, reject) => {
            post_4.save(err => {
                if (err) { return reject(err) }
                console.log('successfully saved post');
                resolve('done');
            })
        });

        const promises = Promise.all([
            adminPromise, 
            comment1Promise, 
            comment2Promise,
            comment3Promise,
            post1Promise, 
            post2Promise,
            nonadminPromise, 
            post3Promise, 
            post4Promise,
        ]);

        return promises;
    });

    describe(`reads posts`, () => {
        describe('route for all posts', () => {
            it ('user authenticated as admin gets all posts', (done) => {
                request(app)
                    .get('/posts')
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '515')
                    .end((err, res) => {
                        if (err) { return done(err) }
                        return done();
                    });
            });

            it (`user authenticated as admin cannot access other posts of other
            users`, (done) => {
                request(app)
                    .get('/posts')
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect((res) => {
                        for (post of res.body) { 
                            if (post.name.includes('Why I fight bears')) { 
                                throw new Error('Admin accesses posts of another user');
                            }
                        }
                    })
                    .end((err, res) => {
                        if (err) { return done(err) }
                        return done();
                    });
            });

            it ('authenticated user gets unpublished post detail', (done) => {
                request(app)
                    .get(`/posts/${POST1ID}`)
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '255', (err, res) => {
                        if (err) { return done(err) }
                        return done();
                    });
            });

            it ('unauthenticated user does not get unpublished post detail', (done) => {
                request(app)
                    .get(`/posts/${POST1ID}`)
                    .expect('Unauthorized', done);
            });

            it ('returns different post for different request URL', (done) => {
                request(app)
                    .get(`/posts/${POST2ID}`)
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect((res) => {
                        if (res.body.name.includes('Why I stopped showering')) {
                            throw new Error('Did not get different post');
                        }
                    })
                    .end((err, res) => {
                        if (err) { return done(err) }
                        done()
                    });
            });

            it ('does not get detail of nonexistent post', (done) => {
                const NONEXISTENTID = mongoose.Types.ObjectId().toString();

                // supertest combines assert & arrange into one  
                request(app)
                    .get(`/posts/${NONEXISTENTID}`)
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('null', done);
            });
        });

        describe('route for only published posts', () => {
            it ('unauthenticated user gets published posts', (done) => {
                request(app)
                    .get('/posts/published_posts')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '259')
                    .end((err, res) =>{
                        if (err) { return done(err) }
                        done();
                    });
            });

            it ('authenticated user gets published post detail', (done) => {
                request(app)
                    .get(`/posts/published_posts/${POST2ID}`)
                // different types of authorization (authentication) 
                // - basic (id, password), bearer (tokens) - bearer keyword 
                // indicates we are using token (specifially JWT) authentication
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '257')
                    .end((err, res) => {
                        if (err) { return done(err) }
                        done();
                    });
            });

            it ('unauthenticated user gets published post detail', (done) => {
                request(app)
                    .get(`/posts/published_posts/${POST2ID}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '257')
                    .end((err, res) => {
                        if (err) { return done(err) }
                        done();
                    });           
            });

            it (`does not get unpublished post detail`, (done) => {
                request(app)
                    .get(`/posts/published_posts/${POST1ID}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('null', done);
            });

            it ('does not get detail of nonexistent post', (done) => {
                const NONEXISTENTID = mongoose.Types.ObjectId().toString();

                // supertest combines assert & arrange into one  
                request(app)
                    .get(`/posts/published_posts/${NONEXISTENTID}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('null', done);
            });
        });
    });

    describe('creates post', () => {
        it ('works for authenticated user', (done) => {
            request(app)
                .post('/posts')
                .set('authorization', `bearer ${jwt}`)
                .type('form')
                .send({
                    name: 'My Productive Marriage', 
                    date_made: new Date(), 
                    is_published: true, 
                    content: 'So far, we have had 3 kids',
                    author: ADMINID
                })
                .then(res => {
                    request(app)
                        .get('/posts')
                        .set('authorization', `bearer ${jwt}`)
                        .expect((res) => {
                            let instance = 0;
                            for (post of res.body) { 
                                if (post.name === 'My Productive Marriage') {
                                    instance++;
                                }
                            }
                            if (!instance) { 
                                throw new Error('Did not create form');
                            }
                        })
                        .end((err, res) => {
                            if (err) { return done(err) }
                            done();
                        });
                });
        });

        it ('fails for not authenticated user', (done) => {
            request(app)
                .post('/posts')
                .type('form')
                .send({
                    name: 'My Productive Marriage', 
                    date_made: new Date(), 
                    is_published: true, 
                    content: 'So far, we have had 3 kids',
                    author: ADMINID
                })
                .expect('Unauthorized', done);
        });
    });

    describe('updates posts', () => {
        it ('works for authenticated user', (done) => {
            request(app)
                .put(`/posts/${POST1ID}`)
                .set('authorization', `bearer ${jwt}`)
                .type('form')
                .send({
                    name: 'Why I stopped sharing (editted version)', 
                    date_made: new Date(), 
                    is_published: true, 
                    content: 'I have lied to all of you ...',
                    comments: [],
                })
                .then(res => { 
                    request(app)
                        .get('/posts')
                        .set('authorization', `bearer ${jwt}`)
                        .expect((res) => {
                            let instance = 0;
                            for (post of res.body) { 
                                if (post.name === 
                                    'Why I stopped sharing (editted version)') {
                                    instance++;
                                }
                            }
                            if (!instance) { 
                                throw new Error('Did not update form');
                            }
                        })
                        .end((err, res) => {
                            if (err) { return done(err) }
                            done();
                        });
            })
        });

        it ('fails for not authenticated user', (done) => {
            request(app)
                .put(`/posts/${POST1ID}`)
                .type('form')
                .send({
                    name: 'Why I stopped sharing (editted version)', 
                    date_made: new Date(), 
                    is_published: true, 
                    content: 'I have lied to all of you ...',
                    comments: [],
                })
                .expect('Unauthorized', done);
        });
    });

    describe('deletes post', () => {
        it ('works for authenticated user', (done) => {
            request(app)
                .delete(`/posts/${POST1ID}`)
                .set('authorization', `bearer ${jwt}`)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .then(res => {
                    request(app)
                        .get('/posts')
                        .set('authorization', `bearer ${jwt}`)
                        .expect(res => {
                            for (post of res.body) {
                                if (post._id === POST1ID) {
                                    throw new Error('fail to delete post');
                                }
                            }
                        })
                        .end((err, res) => {
                            if (err) { return done(err) }
                            done();
                        })
                });
        });

        it ('fails for not authenticated user', (done) => {
            request(app)
                .delete(`/posts/${POST1ID}`)
                .expect('Unauthorized', done);
        });
    });

    describe('comments', () => {
        describe('gets', () => {
            it('from published posts if unauthorized', (done) => {
                request(app)
                    .get(`/posts/published_posts/${POST2ID}/comments`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '300', (err, res) => {
                        if (err) { return done(err) }
                        done();
                    });
            });

            it('from published posts if authorized', (done) => {
                request(app)
                    .get(`/posts/published_posts/${POST2ID}/comments`)
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '300', (err, res) => {
                        if (err) { return done(err) }
                        done();
                    });
            });

            it('from all posts if authorized', (done) => {
                request(app)
                    .get(`/posts/${POST1ID}/comments`)
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '300', (err, res) => {
                        if (err) { return done(err) }
                        done();
                    });
            });

            it('fails to get from all posts if unauthorized', (done) => {
                request(app)
                    .get(`/posts/${POST1ID}/comments`)
                    .set('authorization', `bearer ${jwt}`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect('Content-Length', '300', (err, res) => {
                        if (err) { return done(err) }
                        done();
                    });
            });

            it('from only correct post', (done) => {
                request(app)
                    .get(`/posts/${POST1ID}/comments`)
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect((res) => {
                        for (comment of res.body) {
                            if (comment.content === 'A comment for post 2') { 
                                throw new Error('contains comment from other post')
                            }
                        }
                    })
                    .end((err, res) => {
                        if (err) { return done(err) }
                        done();
                    });
            });
        });

        describe('creates', (done) => {
            it('succeeds for authorized user', (done) => {
                request(app)
                    .post(`/posts/published_posts/${POST2ID}/comments`)
                    .set('authorization', `bearer ${jwt}`)
                    .type('form')
                    .send({
                        author: 'Mike Hsiao', 
                        email: '1rod1reel@gmail.com',
                        date_made: new Date(), 
                        content: 'FIST BUMPS!',
                    })
                    .then(res => {
                        request(app)
                            .get(`/posts/${POST2ID}/comments`)
                            .expect(res => {
                                let instance = 0;
                                for (comment of res.body) { 
                                    if (comment.content === 'FIST BUMPS!') {
                                        instance++;
                                    }
                                }
                                if (!instance) { 
                                    throw new Error('did not create comment');
                                }
                            })
                            .end((err, res) => {
                                if (err) { return done(err) }
                                done();
                            })
                    });
            });

            it('succeeds for unauthorized user', (done) => {
                request(app)
                    .post(`/posts/published_posts/${POST2ID}/comments`)
                    .type('form')
                    .send({
                        author: 'Mike Hsiao', 
                        email: '1rod1reel@gmail.com',
                        date_made: new Date(), 
                        content: 'FIST BUMPS!',
                    })
                    .then(res => {
                        request(app)
                            .get(`/posts/${POST2ID}/comments`)
                            .expect(res => {
                                let instance = 0;
                                for (comment of res.body) { 
                                    if (comment.content === 'FIST BUMPS!') {
                                        instance++;
                                    }
                                }
                                if (!instance) { 
                                    throw new Error('did not create comment');
                                }
                            })
                            .end((err, res) => {
                                if (err) { return done(err) }
                                done();
                            });
                    });
            });
        });

        describe('updates', () => {
            it('succeeds for authorized user', (done) => {
                request(app)
                    .put(`/posts/${POST1ID}/comments/${COMMENT1ID}`)
                    .set('authorization', `bearer ${jwt}`)
                    .send({
                        author: "Leon Trotsky", 
                        email: "trotsky@redmail.su", 
                        date_made: new Date(), 
                        content: `Clearly, Lenin is wrong and I am a
                            capitalistic roader`,
                    })
                    .then(res => {
                        request(app)
                            .get(`/posts/${POST1ID}/comments`)
                            .expect(res => {
                                for (comment of res.body) { 
                                    let instance = 0;
                                    if (comment.content = `
                                        Clearly, Lenin is wrong and I am a
                                        capitalistic roader
                                    `) { 
                                        instance++;
                                    }
                                    if (!instance) { 
                                        throw new Error('Did not update');
                                    }
                                }
                            })
                            .end((err, res) => {
                                if (err) { return done(err) }
                                done();
                            });
                    });
            });

            it('fails for unauthorized user', (done) => {
                request(app)
                    .put(`/posts/${POST1ID}/comments/${COMMENT1ID}`)
                    .send({
                        author: "Leon Trotsky", 
                        email: "trotsky@redmail.su", 
                        date_made: new Date(), 
                        content: `Clearly, Lenin is wrong and I am a
                            capitalistic roader`,
                    })
                    .expect('Unauthorized', done);
            });
        });

        describe('deletes', () => {
            it('succeeds for authorized user', (done) => {
                request(app)
                    .delete(`/posts/${POST1ID}/comments/${COMMENT1ID}`)
                    .set('authorization', `bearer ${jwt}`)
                    .then(res => {
                        request(app)
                            .get(`/posts/${POST1ID}/comments`)
                            .set('authorization', `bearer ${jwt}`)
                            .expect(res => {
                                if (!!res.body.length) {
                                    throw new Error('did not delete');
                                }
                            })
                            .end((err, res) => {
                                if (err) { return done(err) }
                                done();
                            });
                    });
            });

            it('fails for unauthorized user', (done) => {
                request(app)
                    .delete(`/posts/${POST1ID}/comments/${COMMENT1ID}`)
                    .expect('Unauthorized', done)
            });
        });
    });
});


