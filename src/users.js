/* eslint-disable max-len */
/**
 *Get, update and delete data 'documents' från database
 */
"use strict";

//process.env.NODE_ENV = 'test';

const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = require('./data.js');

const users = {
    /**
     * get all users from 'users' database
     * @returns {Array}
     */
    getAllUsers: async function() {
        let db = await database.getUsers();
        let result = await db.collection.find({}, {}).limit(0).toArray();

        await db.client.close();
        return result;
    },

    /**
     * update user databse
     * @param {*} doc the documents id
     */
    updateUser: async function(doc) {
        let userDb = await database.getUsers();
        let search = {
            "docs._id": doc
        };

        let updateDoc = {
            $pull: {
                docs: {
                    _id: doc
                }
            }
        };

        await userDb.collection.updateMany(search, updateDoc);
    },

    /**
     * delete the logged in user and his documents
     * @param {*} email user email adress
     * @returns {Array}
     */
    deleteUser: async function(email) {
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
                await users.updateUser(docs[x]._id);
                x += 1;
            }

            await dbUser.collection.findOneAndDelete({ _id: getUser[0]._id });
            return {
                data: "Successfully deleted one user."
            };
        } catch (e) {
            return {
                data: {
                    status: 500,
                    title: "Database error",
                    message: e.message
                }
            };
        } finally {
            await dbUser.client.close();
            await db.client.close();
        }
    },

    /**
     * View the information about a specific user
     * @param {*} id the user id
     * @returns {Array}
     */
    getSpecificUser: async function(id) {
        let db = await database.getUsers();
        let filter = { _id: ObjectId(id) };
        let result = await db.collection.find(filter, {}).toArray();

        await db.client.close();
        return result;
    },

    /**
     * allow user to edit a document
     * @param {*} email the logged in user email adress
     * @param {*} args email and documents id
     * @returns {object}
     */
    allowUser: async function(email, args) {
        let allowedUserEmail = args.email;
        let docId = ObjectId(args.docId);
        let dbUser;
        let userId;
        let allowedUserID;

        if (allowedUserEmail && docId) {
            try {
                dbUser = await database.getUsers();

                // get information about the user
                let userData = await dbUser.collection.find({email: email}, {}).toArray();
                // get information about the user who will have access to the document
                let allowUserData = await dbUser.collection.find({email: allowedUserEmail}, {}).toArray();
                let filter = {
                    _id: allowUserData[0]._id,
                    "docs._id": docId
                };
                let checkDocs = await dbUser.collection.find(filter, {}).toArray();

                if (userData.length >= 1 && allowUserData.length >= 1 && checkDocs.length === 0) {
                    userId = userData[0]._id;
                    allowedUserID = allowUserData[0]._id;

                    let updateUser = {
                        $push: {
                            "docs.$.allowed_users": allowedUserEmail
                        }
                    };
                    let updateAllowedUser = {
                        $push: {
                            docs: {
                                _id: docId,
                                allowed_users: []
                            }
                        }
                    };
                    let filterUser = {
                        _id: userId,
                        "docs._id": docId
                    };

                    await dbUser.collection.updateOne(filterUser, updateUser);
                    await dbUser.collection.updateOne({ _id: allowedUserID}, updateAllowedUser);

                    return {
                        data: `From user ${email} to user ${allowedUserEmail}.`
                    };
                } else {
                    return {
                        data: {
                            status: 500,
                            title: "No email",
                            message: "Could not find email address in database or the user already has the document."
                        }
                    };
                }
            } catch (e) {
                return {
                    data: {
                        status: 500,
                        title: "Database error",
                        message: e.message
                    }
                };
            } finally {
                dbUser.client.close();
            }
        } else {
            return {
                data: {
                    status: 500,
                    title: "No email or document id",
                    message: "No data email or document id provided"
                }
            };
        }
    },

    /**
     * Get user documents id, name and content
     * @param {*} id the user id
     * @returns {Array}
     */
    getUserDocs: async function(id) {
        let user = await users.getSpecificUser(id);
        let res = [];
        let docId = [];

        user[0].docs.map(async (doc) => {
            let id = (doc._id).toString();

            docId.push(id);
        });

        let x = 0;

        while (x < docId.length) {
            let doc = await data.showSpecificDoc(docId[x]);

            res.push(doc[0]);
            x++;
        }
        return res;
    },

    /**
     * check if email exists
     * @param {*} email the user email adress
     * @returns {boolean}
     */
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
