/**
 * General routes.
 */

"use strict";

let express = require('express');
let router = express.Router();

let auth = require('../src/auth.js');
let users = require('../src/users.js');

// get all users
router.get('/', async (request, response) => {
    try {
        let res = await users.getAllUsers();

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

// delete the logged in user
router.delete('/',
    (request, response, next) => auth.checkToken(request, response, next),
    (request, response) => users.deleteUser(request, response)
);

//get a specific user
router.get('/:id', async (request, response) => {
    try {
        let res = await users.getSpecificUser(request.params.id);

        response.json(res);
    } catch (err) {
        response.json(err);
    }
});

// allow user to edit a document
router.put('/',
    (request, response, next) => auth.checkToken(request, response, next),
    (request, response) => users.allowUser(request, response)
);

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


