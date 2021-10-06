/**
 * Route to update data (docoment)
 */

"use strict";

let express = require('express');
let router = express.Router();

let data = require('../src/index.js');

router.put('/:id', async (request, response) => {
    try {
        let body = request.body;
        let res = await data.updateData(request.params.id, body);

        //console.log(request.body);
        response.json(res);
    } catch (err) {
        //console.log(err);
        response.json(err);
    }
});

module.exports = router;
