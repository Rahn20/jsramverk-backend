/* eslint-disable max-len */
/**
 *
 */
"use strict";

//process.env.NODE_ENV = 'test';

const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;


let users = {
    // get all users from 'users' database
    getAllUsers: async function() {
        let db = await database.getUsers();
        let result = await db.collection.find({}, {}).limit(0).toArray();

        await db.client.close();
        return result;
    },

    delete: async function(doc) {
        let userDb = await database.getUsers();
        let search = {
            "docs._id": doc
        };

        //let find = await userDb.collection.find(search, {}).toArray();
        let updateDoc = {
            $pull: {
                docs: {
                    _id: doc
                }
            }
        };

        await userDb.collection.updateMany(search, updateDoc);
    },

    //delete the logged in user and his documents
    deleteUser: async function(request, response) {
        // request contains user object set in checkToken middleware
        let email = request.user.email;
        let dbUser;
        let db;

        try {
            dbUser = await database.getUsers();

            let getUser = await dbUser.collection.find({email: email}, {}).toArray();
            let docs = getUser[0].docs;
            let x = 0;

            db = await database.getDocs();

            while (x < docs.length) {
                await db.collection.deleteMany({ _id: docs[x]._id });
                await users.delete(docs[x]._id);
                x += 1;
            }

            await dbUser.collection.findOneAndDelete({ _id: getUser[0]._id });
            return response.status(201).json({
                result: "Successfully deleted one user."
            });
        } catch (e) {
            return response.status(500).json({
                error: {
                    status: 500,
                    title: "Database error",
                    message: e.message
                }
            });
        } finally {
            await dbUser.client.close();
            await db.client.close();
        }
    },

    //View the information about a specific user
    getSpecificUser: async function(id) {
        let db = await database.getUsers();
        let filter = { _id: ObjectId(id) };
        let result = await db.collection.find(filter, {}).toArray();

        await db.client.close();
        return result;
    },

    //allow user to edit a document
    allowUser: async function(request, response) {
        // req contains user object set in checkToken middleware
        let email = request.user.email;
        let allowedUser = request.body.email;
        let docId = ObjectId(request.body.doc_id);
        let dbUser;
        let userId;
        let allowedUserID;

        if (allowedUser && docId) {
            try {
                dbUser = await database.getUsers();

                let userData = await dbUser.collection.find({email: email}, {}).toArray();
                let allowUserData = await dbUser.collection.find({email: allowedUser}, {}).toArray();
                let filter = {
                    _id: allowUserData[0]._id,
                    "docs._id": docId
                };
                let checkDocs = await dbUser.collection.find(filter, {}).toArray();

                if (userData.length >= 1 && allowUserData.length >= 1 && checkDocs.length === 0) {
                    userData.map(function(user) {
                        userId = user._id;
                    });

                    allowUserData.map(function(user) {
                        allowedUserID = user._id;
                    });

                    let updateUser = {
                        $push: {
                            "docs.$.allowed_users": allowedUser
                        }
                    };

                    let updateAllowedUser = {
                        $push: {
                            docs: {
                                _id: docId
                            }
                        }
                    };

                    let filter = {
                        _id: userId,
                        "docs._id": docId
                    };


                    await dbUser.collection.updateOne(filter, updateUser);
                    await dbUser.collection.updateOne({ _id: allowedUserID}, updateAllowedUser);

                    return response.status(201).json({
                        FromUser: email,
                        ToUser: allowedUser,
                        DocumentID: docId
                    });
                } else {
                    return response.status(500).json({
                        status: 500,
                        title: "No email",
                        message: "Could not find email address in database or the user already has the document."
                    });
                }
            } catch (e) {
                return response.status(500).json({
                    error: {
                        status: 500,
                        title: "Database error",
                        message: e.message
                    }
                });
            } finally {
                dbUser.client.close();
            }
        } else {
            return response.status(500).json({
                error: {
                    status: 500,
                    title: "No email or document id",
                    message: "No data email or document id provided"
                }
            });
        }
    },

    checkEmail: async function(email) {
        let res = await users.getAllUsers();
        let result;

        res.map(function(user) {
            if (user.email === email) {
                result = true;
            } else {
                result = false;
            }
        });

        return result;
    }
};

module.exports = users;
