/**
 *
 */
"use strict";

//process.env.NODE_ENV = 'test';

const database = require("../db/database.js");
const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "./setup.json"),
    "utf8"
));

let data = {
    //Reset a collection by removing existing content and insert a default
    resetCollection: async function() {
        let db = await database.getDb();

        await db.collection.deleteMany();
        await db.collection.insertMany(docs);
        await db.client.close();
    },

    //view the contents of the database
    showData: async function() {
        let db = await database.getDb();
        const result = await db.collection.find({}, {}).limit(0).toArray();

        await db.client.close();
        return result;
    },

    //view the content of a specific document
    showSpecificDoc: async function(id) {
        let db = await database.getDb();
        const ObjectId = require('mongodb').ObjectId;
        const filter = { _id: ObjectId(id) };
        const result = await db.collection.find(filter, {}).toArray();

        await db.client.close();
        return result;
    },

    //update a specific document in the database
    updateData: async function(id, body) {
        let db = await database.getDb();
        const ObjectId = require('mongodb').ObjectId;
        const filter = { _id: ObjectId(id) };
        const search = await db.collection.find(filter, {}).toArray();
        let bodyDoc = {};

        for (const [skey] of Object.entries(search[0])) {
            for (const [bkey, bvalue] of Object.entries(body)) {
                if (skey == bkey) {
                    //console.log(bkey);
                    bodyDoc[bkey] = bvalue;
                }
            }
        }

        let updateDocument = { $set: bodyDoc};
        const result = await db.collection.updateOne(filter, updateDocument);

        await db.client.close();
        return result;
    },

    //create new document in planet database
    createData: async function(body) {
        let db = await database.getDb();
        const result = await db.collection.insertOne(body);

        await db.client.close();
        return result;
    }
};

module.exports = data;
