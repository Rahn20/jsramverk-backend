/* eslint-disable no-undef */
/* eslint-disable max-len */
/**
* testfile
*/
"use strict";

process.env.NODE_ENV = 'test';

const assert = require('assert');
const expect = require('chai').expect;

const data = require('../src/data');
const users = require('../src/users');


/**
 * Testsuite
 */
describe('5- Testing users-file', () => {
    it('5.1 create documents to our user, should create 2 new document to our test1-user', () => {
        let timeout = async () => {
            let body = {
                name: "Mocha 1",
                content: "<p>Create document 1 </p>"
            };
            let body2 = {
                name: "Mocha 2",
                content: "<p>Create document 2 </p>"
            };

            let create = await data.createData("test1@bth.se", body);
            let create2 = await data.createData("test1@bth.se", body2);
            let docs = await data.getAllDocs();

            assert.equal(create.data, "The document has been created.");
            assert.equal(create2.data, "The document has been created.");
            assert.equal(docs.length, 8);
        };

        setTimeout(timeout, 500);
    });

    it('5.2 testing getSpecificUser(), should get the first user in the users_data-collection', async () => {
        let getUsers = await users.getAllUsers();
        let getId = (getUsers[0]._id).toString();
        let res = await users.getSpecificUser(getId);

        assert.equal(getUsers[0].name, res[0].name);
        assert.equal(getUsers[0].email, res[0].email);
        assert.equal(getUsers[0].docs.length, res[0].docs.length);
    });


    it('5.3 testing getUserDocs(), should get the first user documents', () => {
        let timeout = async () => {
            let getUsers = await users.getAllUsers();
            let getId = (getUsers[0]._id).toString();
            let res = await users.getUserDocs(getId);

            assert.equal(getUsers[0].docs.length, res.length);
            assert.equal(res[0].name, "Mocha 1");
            assert.equal(res[0].content, "<p>Create document 1 </p>");
            assert.equal(res[1].name, "Mocha 2");
            assert.equal(res[1].content, "<p>Create document 2 </p>");
        };

        setTimeout(timeout, 500);
    });


    it('5.4 testing allowUser(), should allow user 1 "second user" to edit first users document', () => {
        let timeout = async () => {
            let getUsers = await users.getAllUsers();
            let getId0 = (getUsers[0]._id).toString();
            let getId1 = (getUsers[1]._id).toString();

            let userDocs = await users.getUserDocs(getId0);
            let body = {
                email: getUsers[1].email,
                docId: userDocs[0]._id
            };

            let res = await users.allowUser(getUsers[0].email, body);
            let checkUserDoc = await users.getUserDocs(getId1);

            assert.equal(res.data, `From user ${getUsers[0].email} to user ${getUsers[1].email}.`);
            assert.equal(checkUserDoc.length, 1);
        };

        setTimeout(timeout, 500);
    });

    it('5.5 testing checkEmail, should be false if email does not exist in our database', async () => {
        let check = await users.checkEmail("emailDoesNotExist@.bth.se");

        expect(check).to.be.false;
    });


    it('5.6 testing deleteUser(), should delete the test-users we have created', async () => {
        let user1 = await users.deleteUser("test1@bth.se");
        let user2 = await users.deleteUser("test2@bth.se");

        let allUsers = await users.getAllUsers();
        let getData = await data.getAllDocs();

        assert(user1.data, "Successfully deleted one user.");
        assert(user2.data, "Successfully deleted one user.");

        // deleting the users means deleting their documents which was 2
        assert.equal(getData.length, 6);
        assert.equal(allUsers.length, 0);
    });
});


