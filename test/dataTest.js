/* eslint-disable no-undef */
/* eslint-disable max-len */
/**
* testfile
*/
"use strict";

process.env.NODE_ENV = 'test';

const assert = require('assert');

const data = require('../src/data');
const auth = require('../src/auth');
const users = require('../src/users');

const fs = require("fs");
const path = require("path");
const jsonData = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "./../src/data/setup.json"), "utf8")
);


/**
 * Testsuite
 */
describe('1- Testing data-file', () => {
    it('1.1 testing testRegister() in auth-file, should create 2 test-users to update/create testdata', async () => {
        let content = {
            email: "test@bth.se",
            name: "Mocha",
            password: "mocha123"
        };

        let content1 = {
            email: "test1@bth.se",
            name: "Chai",
            password: "chai0987"
        };

        await auth.testRegister(content);
        await auth.testRegister(content1);
    });


    it('1.2 testing resetCollection(), should have same JSON-data', async () => {
        let reset = await data.resetCollection();
        let res = await data.getAllDocs();
        let x = 0;

        while (x < jsonData.length) {
            assert.equal(reset.data, "Data has been restored.");
            assert.equal(res[x].name, jsonData[x].name);
            assert.equal(res[x].content, jsonData[x].content);
            x += 1;
        }
    });


    it('1.3 testing showSpecificDoc(), should get the first document in the doc-collection', async () => {
        let getData = await data.getAllDocs();
        let getId = (getData[0]._id).toString();
        let res = await data.showSpecificDoc(getId);

        assert.equal(getData[0].name, res[0].name);
        assert.equal(getData[0].content, res[0].content);
    });


    it('1.4 testing createData(), should create 3 new documents to our test-users', async () => {
        let body = {
            name: "Mocha",
            content: "<p>Testing create function</p>"
        };

        let create = await data.createData("test@bth.se", body);
        let getData = await data.getAllDocs();
        let lastDoc = getData.length - 1;

        assert.equal(create.data, "The document has been created.");
        assert.equal(getData[lastDoc].name, body.name);
        assert.equal(getData[lastDoc].content, body.content);
        assert.equal(getData.length, 7);
    });


    it('1.5 test-user should get the document we have created', () => {
        let timeout = async () => {
            let getUsers = await users.getAllUsers();
            let getId = (getUsers[0]._id).toString();
            let res = await users.getUserDocs(getId);

            assert.equal(res.length, 1);
            assert.equal(res[0].name, "Mocha");
            assert.equal(res[0].content, "<p>Testing create function</p>");
        };

        setTimeout(timeout, 1000);
    });

    it('1.6 testing updateData(), should update last document in doc-collection', async () => {
        let getData = await data.getAllDocs();
        let getId = (getData[getData.length - 1]._id).toString();
        let content = "<p>Testing update function</p>";

        let res = await data.updateData("test@bth.se", content, getId);
        let doc = await data.getAllDocs();

        assert.equal(res.data, "The document has been updated.");
        assert.equal(doc[doc.length - 1].name, "Mocha");
        assert.equal(doc[doc.length - 1].content, content);
    });


    it('1.7 testing deleteData(), should delete last document in doc-collection', async () => {
        let getData = await data.getAllDocs();
        let getId = (getData[getData.length - 1]._id).toString();
        let res = await data.deleteData("test@bth.se", getId);

        assert.equal(res.data, "The document has been deleted.");
        assert.equal(getData.length - 1, 6);
    });

    it('1.8 test-user should no longer have the document that we have deleted', async () => {
        let getUsers = await users.getAllUsers();
        let getId = (getUsers[0]._id).toString();
        let res = await users.getUserDocs(getId);

        assert.equal(res.length, 0);
    });
});
