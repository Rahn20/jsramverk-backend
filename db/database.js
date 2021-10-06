/**
 *
 */

"use strict";

const mongo = require("mongodb").MongoClient;
const config = require("./config.json");

const database = {
    getDb: async function getDb() {
        let dsn = `mongodb+srv://${config.username}:${config.password}` +
            `@cluster1.hisbu.mongodb.net/planets?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            // We can even use MongoDB Atlas for testing
            dsn = "mongodb://localhost:27017/test";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection("doc");

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
