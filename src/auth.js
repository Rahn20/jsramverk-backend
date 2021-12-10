/**
 *
 */
"use strict";

//process.env.NODE_ENV = 'test';

const database = require("../db/database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../db/config.json');

const jwtSecret = process.env.JWT_SECRET || config.secret;

const auth = {
    // register a user
    register: async function(body, response) {
        let name = body.name;
        let email = body.email;
        let password = body.password;
        let saltRounds = 10;

        if (!email || !password) {
            return response.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                return response.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            let db;

            try {
                db = await database.getUsers();
                let usersData = {
                    name: name,
                    email: body.email,
                    password: hash,
                    docs: [],
                };

                await db.collection.insertOne(usersData);

                return response.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });
            } catch (e) {
                return response.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: err.message
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },

    // log in user
    login: async function(body, response) {
        let email = body.email;
        let password = body.password;

        if (!email || !password) {
            return response.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        } else {
            let db;

            try {
                db = await database.getUsers();
                const user = await db.collection.findOne({email: email});

                if (user) {
                    return auth.comparePasswords(response, password, user);
                } else {
                    return response.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "User not found",
                            detail: "User with provided email not found."
                        }
                    });
                }
            } catch (e) {
                return response.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "Database error",
                        detail: e.message
                    }
                });
            } finally {
                await db.client.close();
            }
        }
    },

    // compare the password
    comparePasswords: function(response, password, user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return response.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { email: user.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });

                return response.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        userId: user._id,
                        userName: user.name,
                        token: jwtToken
                    }
                });
            } else {
                return response.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "Wrong password",
                        detail: "Password is incorrect."
                    }
                });
            }
        });
    },

    // check the token
    checkToken: function(context) {
        let token = context.headers['x-access-token'];
        let email = "";

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return {
                        data: {
                            status: 500,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    };
                }

                email = decoded.email;
            });

            return { "email": email};
        } else {
            return {
                data: "No token"
            };
        }
    }

};

module.exports = auth;
