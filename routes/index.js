/**
 * General routes.
 */

"use strict";

let express = require('express');
let router = express.Router();

const auth = require('../src/auth.js');
const users = require('../src/users.js');
//const data = require('../src/data.js');

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

// register user
router.post('/register', async (request, response) => {
    try {
        let userData = await users.checkEmail(request.body.email);

        if (userData) {
            return response.json({
                errors: {
                    status: 401,
                    source: "/login",
                    message: "Email already exists."
                }
            });
        } else {
            auth.register(request.body, response);
        }
    } catch (err) {
        response.json(err);
    }
});


// log in user
router.post('/login', (request, response) => auth.login(request.body, response));

module.exports = router;
