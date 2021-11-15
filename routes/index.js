/**
 * General routes.
 */

"use strict";

let express = require('express');
let router = express.Router();

let data = require('../src/data.js');
let auth = require('../src/auth.js');

// test
/*
router.put('/:id', async (request, response) => {
    try {
        let res = await data.test(request.params.id);

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});*/

// get all documents
router.get('/', async (request, response) => {
    try {
        let res = await data.showData();

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

// reset the documents
router.get('/reset', async (request, response) => {
    try {
        await data.resetCollection();

        let res = await data.showData();

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

// get a specific document
router.get('/document/:id', async (request, response) => {
    try {
        let res = await data.showSpecificDoc(request.params.id);

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

// create a document
router.post('/create',
    (request, response, next) => auth.checkToken(request, response, next),
    (request, response) => data.createData(request, response)
);

// delete a document
router.delete('/delete/:id',
    (request, response, next) => auth.checkToken(request, response, next),
    (request, response) => data.deleteData(request, response)
);


module.exports = router;
