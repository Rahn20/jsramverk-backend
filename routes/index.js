/**
 * General routes.
 */

"use strict";

let express = require('express');
let router = express.Router();

let data = require('../src/index.js');

router.get('/', async (request, response) => {
    try {
        let res = await data.showData();

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

router.get('/reset', async (request, response) => {
    try {
        await data.resetCollection();

        let res = await data.showData();

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

router.get('/document/:id', async (request, response) => {
    try {
        let res = await data.showSpecificDoc(request.params.id);

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

router.post('/create', async (request, response) => {
    try {
        let body = request.body;
        let res = await data.createData(body);

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

module.exports = router;
