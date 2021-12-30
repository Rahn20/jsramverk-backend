/* eslint-disable max-len */
/* eslint-disable no-undef */
/**
* testfile
*/
"use strict";

process.env.NODE_ENV = 'test';

const data = require('../src/data');
const server = require('../app');

//test
const assert = require('assert');

//chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

let docId = "";
let userId = "";

describe("2- Testing GraphQL", () => {
    describe("2.1 Query Test", () => {
        it("2.1.1 Should get all documents", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({query: '{ getDocs { _id, name, content } }'})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('getDocs');
                    res.body.data.getDocs[0].should.have.property('_id');
                    res.body.data.getDocs[0].should.have.property('name');
                    res.body.data.getDocs[0].should.have.property('content');

                    docId = res.body.data.getDocs[0]._id;
                    assert.equal((res.body.data.getDocs).length, 6);

                    done();
                });
        });

        it("2.1.2 Should get a specific document", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({query: `{ doc(_id: "${docId}") { _id, name, content } }`})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('doc');
                    res.body.data.doc[0].should.have.property('_id');
                    res.body.data.doc[0].should.have.property('name');
                    res.body.data.doc[0].should.have.property('content');

                    assert.equal((res.body.data.doc).length, 1);
                    done();
                });
        });


        it("2.1.3 Should reset the documents", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({query: '{ reset { data } }'})
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(err).to.be.null;
                    res.body.data.should.have.property('reset');
                    res.body.data.reset.should.have.property('data').eql('Data has been restored.');

                    done();
                });
        });


        it("2.1.4 Should get all users", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({query: '{ getUsers { _id, name, email, docs {_id, allowed_users} } }'})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('getUsers');
                    res.body.data.getUsers[0].should.have.property('_id');
                    res.body.data.getUsers[0].should.have.property('name');
                    res.body.data.getUsers[0].should.have.property('email');
                    res.body.data.getUsers[0].should.have.property('docs');

                    userId = res.body.data.getUsers[0]._id;
                    assert.equal((res.body.data.getUsers).length, 2);

                    done();
                });
        });


        it("2.1.5 Should get a specific user", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({query: `{ user(_id: "${userId}") { _id, name, email } }`})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('user');
                    res.body.data.user[0].should.have.property('_id');
                    res.body.data.user[0].should.have.property('name');
                    res.body.data.user[0].should.have.property('email');

                    assert.equal((res.body.data.user).length, 1);
                    done();
                });
        });
    });


    describe('2.2 POST /me-api/login', () => {
        it('Should log in the test-user', (done) => {
            chai.request(server)
                .post("/me-api/login")
                .send({ email: "test@bth.se", password: "mocha123"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    res.body.data.should.have.property('type').eql('success');
                    res.body.data.should.have.property('message').eql('User logged in');
                    res.body.data.user.should.have.property('email').eql('test@bth.se');
                    res.body.data.should.have.property('userName').eql('Mocha');

                    process.env.NODE_TOKEN = res.body.data.token;
                    done();
                });
        });
    });


    describe("2.3 Mutation Test", () => {
        it("2.3.1 Add a new document to our test-user", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({ query: 'mutation { addDoc(name: "Mocha", content: "<p> Testing graphQl </p>") { data } }'})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('addDoc');
                    res.body.data.addDoc.should.have.property('data').eql('The document has been created.');

                    done();
                });
        });


        it('2.3.2 Testing getAllDocs(), Should get the last document we have created', async () => {
            let getData = await data.getAllDocs();
            let lastDoc = getData.length - 1;

            docId = getData[lastDoc]._id;
            assert.equal(getData[lastDoc].name, "Mocha");
            assert.equal(getData[lastDoc].content, "<p> Testing graphQl </p>");
        });


        it("2.3.3 Update last document", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({ query: `mutation { updateDoc(docId: "${docId}", content: "<p> Update graphQl </p>") { data } }`})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('updateDoc');
                    res.body.data.updateDoc.should.have.property('data').eql('The document has been updated.');

                    done();
                });
        });


        it("2.3.4 Should get test-user documents", (done) => {
            let timeout = () => {
                chai.request(server)
                    .post("/me-api/graphql")
                    .send({query: `{ userDocs(_id: "${userId}") { _id, name, content } }`})
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(200);
                        res.body.data.should.have.property('userDocs');
                        res.body.data.userDocs[0].should.have.property('_id');
                        res.body.data.userDocs[0].should.have.property('name');
                        res.body.data.userDocs[0].should.have.property('content');

                        assert.equal((res.body.data.userDocs).length, 1);

                        done();
                    });
            };

            setTimeout(timeout, 1200);
        });


        it("2.3.5 Should allow test1-user to edit test-user document", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({ query: `mutation { allowUser(docId: "${docId}", email: "test1@bth.se") { data } }`})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('allowUser');
                    res.body.data.allowUser.should.have.property('data').eql('From user test@bth.se to user test1@bth.se.');

                    done();
                });
        });


        it("2.3.6 Should delete last document", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({ query: `mutation { deleteDoc(id: "${docId}") { data } }`})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('deleteDoc');
                    res.body.data.deleteDoc.should.have.property('data').eql('The document has been deleted.');

                    done();
                });
        });

        it("2.3.7 Should delete test-user", (done) => {
            chai.request(server)
                .post("/me-api/graphql")
                .send({ query: "mutation { deleteUser { data } }"})
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.data.should.have.property('deleteUser');
                    res.body.data.deleteUser.should.have.property('data').eql('Successfully deleted one user.');

                    done();
                });
        });
    });
});
