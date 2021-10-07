/* eslint-disable no-undef */
/**
* testfile
*/

process.env.NODE_ENV = 'test';

"use strict";

const assert = require('assert');

const index = require('../src/index');

const fs = require("fs");
const path = require("path");
const jsonData = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "./../src/setup.json"), "utf8")
);


/**
 * Testsuite
 */
describe('1- Testing index-file', () => {
    it('1.1 testing resetCollection(), should have same JSON data', async () => {
        await index.resetCollection();
        let res = await index.showData();
        let x = 0;

        while (x <= jsonData.length -1) {
            assert.equal(res[x].name, jsonData[x].name);
            assert.equal(res[x].content, jsonData[x].content);
            x += 1;
        }
    });

    it('1.2 testing updateData(), updates first array (docs)', async () => {
        let getData = await index.showData();
        let getId = (getData[0]._id).toString();
        let body = {
            name: "Mocha",
            content: "<p>Testing update function</p>"
        };

        await index.updateData(getId, body);
        let newData = await index.showData();

        assert.equal(newData[0].name, body.name);
        assert.equal(newData[0].content, body.content);
    });

    it('1.3 testing createData(), adds new data', async () => {
        let body = {
            name: "Mocha",
            content: "<p>Testing create function</p>"
        };

        await index.createData(body);

        let getData = await index.showData();
        let lastArray = getData.length - 1;

        assert.equal(getData[lastArray].name, body.name);
        assert.equal(getData[lastArray].content, body.content);
    });
});
