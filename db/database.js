/**
 * database
 */

"use strict";

const mongo = require("mongodb").MongoClient;
const config = process.env.rahn20 || require("./config.json");

const database = {
    getDocs: async function () {
        let dsn = `mongodb+srv://${config.username}:${config.password}` +
            `@cluster1.hisbu.mongodb.net/planets?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            // We can even use MongoDB Atlas for testing
            dsn = "mongodb://localhost:27017/testDocs";
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
    },


    getUsers: async function () {
        let dsn = `mongodb+srv://${config.username}:${config.password}` +
            `@cluster1.hisbu.mongodb.net/users?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/testUsers";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection("users_data");

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;

