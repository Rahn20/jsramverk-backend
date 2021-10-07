/* eslint-disable no-undef */
/**
* testfile
*/

process.env.NODE_ENV = 'test';

"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;

const index = require('../src/index');

chai.should();
chai.use(chaiHttp);


/**
 * Testsuite
 */
describe('2- Testing routes-files', () => {
    describe('2.1 GET /me-api', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/me-api")
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body.length.should.be.above(0);

                    done();
                });
        });
    });

    describe('2.2 GET /me-api/reset', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/me-api/reset")
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body.length.should.be.above(0);
                    expect(res.body).to.not.be.empty;

                    done();
                });
        });
    });

    describe('2.3 Getting an ID', () => {
        let getId;

        before(async () => {
            let getData = await index.showData();

            getId = (getData[0]._id).toString();
        });

        describe('PUT /me-api/update/<id>', () => {
            it('200 HAPPY PATH', (done) => {
                chai.request(server)
                    .put(`/me-api/update/${getId}`)
                    .send({ name: 'Mocha', content: '<p>Testing update function</p>' })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        res.body.should.be.an("object");
                        expect(res.body).to.not.be.empty;

                        done();
                    });
            });
        });
    });

    describe('2.4 POST /me-api/create', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/me-api/create")
                .send({ name: 'Mocha', content: 'Testing create function' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    res.body.should.be.an("object");
                    expect(res.body).to.not.be.empty;

                    done();
                });
        });
    });

    describe('2.5 GET /test', () => {
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
});
