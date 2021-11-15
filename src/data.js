/**
 *
 */
"use strict";

//process.env.NODE_ENV = 'test';

const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const path = require("path");
const fs = require("fs");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "./setup.json"),
    "utf8"
));

let data = {
    //Reset a collection by removing existing content and insert with default data
    resetCollection: async function() {
        let db = await database.getDocs();

        await db.collection.deleteMany();
        await db.collection.insertMany(docs);
        await db.client.close();
    },

    //view the contents of the 'planets' database
    showData: async function() {
        let db = await database.getDocs();
        const result = await db.collection.find({}, {}).limit(0).toArray();

        await db.client.close();
        return result;
    },

    //view the content of a specific document
    showSpecificDoc: async function(id) {
        let db = await database.getDocs();
        const filter = { _id: ObjectId(id) };
        const result = await db.collection.find(filter, {}).toArray();

        await db.client.close();
        return result;
    },

    //update a specific document in the database
    updateData: async function(request, response) {
        // req contains user object set in checkToken middleware
        let email = request.user.email;
        let content = request.body.content;
        let docId = request.body._id;
        let db;

        if (content && docId) {
            try {
                // check if the document belongs to the loged in user
                let dbUser = await database.getUsers();
                let find = {
                    email: email,
                    "docs._id": ObjectId(docId)
                };

                let userData = await dbUser.collection.find(find, {}).toArray();

                await dbUser.client.close();

                if (userData.length >= 1) {
                    db = await database.getDocs();
                    let result = await data.showSpecificDoc(docId);
                    let filter = { _id: result[0]._id };
                    let updateDocument = {
                        $set: {
                            name: result[0].name,
                            content: content
                        }
                    };

                    await db.collection.updateOne(filter, updateDocument);

                    return response.status(201).json({
                        Result: "The document has been updated."
                    });
                } else {
                    return response.status(500).json({
                        Result: "The document does not belong to the user."
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
                await db.client.close();
            }
        } else {
            return response.status(500).json({
                error: {
                    status: 500,
                    title: "No content",
                    message: "No data content provided"
                }
            });
        }
    },

    //create new document in 'planet' database and connect the document to the logged in user
    createData: async function(request, response) {
        // req contains user object set in checkToken middleware
        let email = request.user.email;
        let body = request.body;
        let db;
        let dbUser;

        try {
            db = await database.getDocs();
            let newDoc = await db.collection.insertOne(body);

            dbUser = await database.getUsers();

            let userData = await dbUser.collection.find({email: email}, {}).toArray();
            let updateDoc = {
                $push: {
                    docs: {
                        _id: newDoc.insertedId,
                        allowed_users: []
                    }
                }
            };

            await dbUser.collection.updateOne({_id: userData[0]._id}, updateDoc);
            return response.status(201).json({
                data: newDoc
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
            await db.client.close();
            await dbUser.client.close();
        }
    },

    // delete a document
    deleteDocument: async function(docId) {
        let dbDoc = await database.getDocs();

        await dbDoc.collection.findOneAndDelete(docId);
        await dbDoc.client.close();
    },

    //delete a document in 'planet' database and update 'users' database by removing document's id
    deleteData: async function(request, response) {
        // req contains user object set in checkToken middleware
        let email = request.user.email;
        let docId = ObjectId(request.params.id);

        if (request.params.id) {
            // check if the document belongs to the loged in user
            let dbUser = await database.getUsers();
            let find = {
                email: email,
                "docs._id": docId
            };

            let userData = await dbUser.collection.find(find, {}).toArray();

            if (userData.length >= 1) {
                try {
                    let updateDoc = {
                        $pull: {
                            docs: {
                                _id: docId
                            }
                        }
                    };

                    let filter = {
                        "docs._id": docId
                    };

                    await dbUser.collection.updateMany(filter, updateDoc);
                    //await dbUser.collection.updateOne({_id: userData[0]._id}, updateDoc);
                    await dbUser.client.close();

                    await data.deleteDocument({_id: docId});

                    return response.status(204).send();
                } catch (e) {
                    return response.status(500).json({
                        error: {
                            status: 500,
                            title: "Database error",
                            message: e.message
                        }
                    });
                }
            } else {
                return response.status(500).json({
                    Result: "The document does not belong to the user."
                });
            }
        } else {
            return response.status(500).json({
                error: {
                    status: 500,
                    title: "No id",
                    message: "No data id provided"
                }
            });
        }
    },

    // add document to a specific user
    test: async function(id) {
        let db = await database.getUsers();
        let docId = ObjectId(id);
        let userId = ObjectId("6191a94997e265591c6db6b5");

        let updateDoc = {
            $push: {
                docs: {
                    _id: docId,
                    allowed_users: []
                }
            }
        };

        await db.collection.updateOne({_id: userId}, updateDoc);
        await db.client.close();
        return docs;
    }
};

module.exports = data;
