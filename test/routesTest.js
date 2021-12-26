/* eslint-disable max-len */
/* eslint-disable no-undef */
/**
* testfile
*/
"use strict";

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);


/**
 * Testsuite
 */
describe('3- Testing routes-files', () => {
    describe('3.1 POST /me-api/register', () => {
        it('3.1.1 Should register a new user, registring test2', (done) => {
            chai.request(server)
                .post("/me-api/register")
                .send({ name: 'test',  email: "test2@bth.se", password: "chai0987"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.have.property('message').eql('User successfully registered.');

                    done();
                });
        });


        it('3.1.2 Should get the password is missing error', (done) => {
            chai.request(server)
                .post("/me-api/register")
                .send({ email: "test1@bth.se"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(401);
                    res.body.should.be.an("object");

                    res.body.errors.should.have.property('source').eql('/register');
                    res.body.errors.should.have.property('title').eql('Email or password missing');
                    res.body.errors.should.have.property('detail').eql('Email or password missing in request');

                    done();
                });
        });


        it('3.1.3 Should get the Email already exists error', (done) => {
            chai.request(server)
                .post("/me-api/register")
                .send({ email: "test2@bth.se", password: "232344"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.body.should.be.an("object");

                    res.body.errors.should.have.property('source').eql('/register');
                    res.body.errors.should.have.property('message').eql('Email already exists.');

                    done();
                });
        });
    });

    describe('3.2 POST /me-api/login', () => {
        it('3.2.1 Should log in the test2-user', (done) => {
            chai.request(server)
                .post("/me-api/login")
                .send({ email: "test2@bth.se", password: "chai0987"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    res.body.data.should.have.property('type').eql('success');
                    res.body.data.should.have.property('message').eql('User logged in');
                    res.body.data.user.should.have.property('email').eql('test2@bth.se');
                    res.body.data.should.have.property('userName').eql('test');

                    done();
                });
        });

        it('3.2.2 Should get the wrong password error', (done) => {
            chai.request(server)
                .post("/me-api/login")
                .send({ email: "test2@bth.se", password: "chaid11"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(401);
                    res.body.should.be.an("object");

                    res.body.errors.should.have.property('source').eql('/login');
                    res.body.errors.should.have.property('title').eql('Wrong password');
                    res.body.errors.should.have.property('detail').eql('Password is incorrect.');

                    done();
                });
        });

        it('3.2.3 Should get the Email or password missing error', (done) => {
            chai.request(server)
                .post("/me-api/login")
                .send({ email: "test2@bth.se"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(401);
                    res.body.should.be.an("object");

                    res.body.errors.should.have.property('source').eql('/login');
                    res.body.errors.should.have.property('title').eql('Email or password missing');
                    res.body.errors.should.have.property('detail').eql('Email or password missing in request');

                    done();
                });
        });

        it('3.2.4 Should get the User not found error', (done) => {
            chai.request(server)
                .post("/me-api/login")
                .send({ email: "notFound@bth.se", password: "hello"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(401);
                    res.body.should.be.an("object");

                    res.body.errors.should.have.property('source').eql('/login');
                    res.body.errors.should.have.property('title').eql('User not found');
                    res.body.errors.should.have.property('detail').eql('User with provided email not found.');

                    done();
                });
        });
    });
});

// testing route error
describe('4 GET /test', () => {
    it('404 error, testing route that does not exists', (done) => {
        chai.request(server)
            .get("/test")
            .end((err, res) => {
                expect(err).to.be.null;
                res.should.have.status(404);

                done();
            });
    });
});
