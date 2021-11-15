/**
 * Route to update data (docoment)
 */

"use strict";

let express = require('express');
let router = express.Router();

let auth = require('../src/auth.js');
let data = require('../src/data.js');

// update a docuemnt
router.put('/',
    (request, response, next) => auth.checkToken(request, response, next),
    (request, response) => data.updateData(request, response)
);


module.exports = router;
