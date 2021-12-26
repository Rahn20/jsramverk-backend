/**
 * Get, update and delete data 'documents' från database
 */
"use strict";

const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const path = require("path");
const fs = require("fs");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "./data/setup.json"),
    "utf8"
));

const data = {
    /**
     * Reset a collection by removing existing content and insert with default data
     * @returns {Object}
     */
    resetCollection: async function() {
        let db = await database.getDocs();
        let remove = await db.collection.deleteMany();
        let insert = await db.collection.insertMany(docs);

        try {
            if (insert.insertedCount === 6 && remove.acknowledged) {
                return  {
                    data: "Data has been restored."
                };
            }
        } catch (e) {
            return  {
                error: e.message
            };
        } finally {
            await db.client.close();
        }
    },

    /**
     * view the contents of the 'planets' database
     * @returns {Array}
     */
    getAllDocs: async function() {
        const db = await database.getDocs();
        const result = await db.collection.find({}).toArray();

        await db.client.close();
        return result;
    },

    /**
     * view the content of a specific document
     * @param {*} id document id
     * @returns {Array}
     */
    showSpecificDoc: async function(id) {
        let db = await database.getDocs();
        const filter = { _id: ObjectId(id) };
        const result = await db.collection.find(filter, {}).toArray();

        await db.client.close();
        return result;
    },

    /**
     * update a specific document in the database
     * @param {*} email user email adress
     * @param {*} content the new content of the document
     * @param {*} docId the docuemnts id
     * @returns {object}
     */
    updateData: async function(email, content, docId) {
        let db;

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

                return { data: "The document has been updated." };
            } else {
                return { data: "The document does not belong to the user."};
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
            await db.client.close();
        }
    },


    /**
     * create new document in 'planet' database and connect the document to the logged in user
     * @param {*} email user email adress
     * @param {*} args new data to be created
     * @returns {object}
     */
    createData: async function(email, args) {
        let db;
        let dbUser;
        let body = {
            name: args.name,
            content: args.content
        };

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
            return {
                data: "The document has been created."
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
            await db.client.close();
            await dbUser.client.close();
        }
    },

    /**
     * delete a document
     * @param {*} docId the documents id
     */
    deleteDocument: async function(docId) {
        let dbDoc = await database.getDocs();

        await dbDoc.collection.findOneAndDelete(docId);
        await dbDoc.client.close();
    },

    /**
     * delete a document in 'planet' database and update 'users' database by removing document's id
     * @param {*} email the user email adress
     * @param {*} id the docuemnts id
     * @returns {object}
     */
    deleteData: async function(email, id) {
        let docId = ObjectId(id);

        if (id) {
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
                    await dbUser.client.close();

                    await data.deleteDocument({_id: docId});

                    return {data: "The document has been deleted."};
                } catch (e) {
                    return {
                        data: {
                            status: 500,
                            title: "Database error",
                            message: e.message
                        }
                    };
                }
            } else {
                return {
                    data: "The document does not belong to the user."
                };
            }
        } else {
            return {
                data: {
                    status: 500,
                    title: "No id",
                    message: "No data id provided"
                }
            };
        }
    },

    // add document to a specific user
    /*
    test: async function(id) {
        let db = await database.getUsers();
        let docId = ObjectId(id);
        let userId = ObjectId("");

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
    }*/
};

module.exports = data;
