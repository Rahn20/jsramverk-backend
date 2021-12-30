/**
 * main file for me-api
 *
*/
"use strict";

const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

// routes + middleware
const middleware = require("./middleware/index.js");
const routeIndex = require('./routes/index');

// GraphQL
const RootQueryType = require('./graphql/rootQuery.js');
const RootMutationType = require('./graphql/rootMutation.js');
const { GraphQLSchema } = require('graphql');

// use express
const app = express();
const port = process.env.PORT || 1337;
const httpServer = require("http").createServer(app);

// socket.io
const io = require("socket.io")(httpServer, {
    cors: {
        origins: ['http://localhost:4200', 'https://www.student.bth.se/'],
        methods: ["GET", "POST", "PUT"],
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use Middleware
app.use(middleware.logIncomingToConsole);

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined'));
}

// routes
app.use('/me-api', routeIndex);

// use graphQL
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

app.use('/me-api/graphql', graphqlHTTP({
    schema: schema,
    graphiql: false,
}));

// sockets
io.sockets.on('connection', function(socket) {
    console.log("Connected", socket.id);
    let prev;

    socket.on('create', (room) => {
        socket.leave(prev);
        socket.join(room);

        prev = room;
        socket.on('doc', (data) => {
            socket.to(data['_id']).emit("doc", data);
        });
    });
});


// Add routes for 404 and error handling
app.use((req, res, next) => {
    let err = new Error("Not Found");

    err.status = 404;
    next(err);
});

// Start the server
const server = httpServer.listen(port, () => console.log(`Me-API listening on port ${port}!`));

module.exports = server;
