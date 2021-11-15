/**
 * main file
 *
*/
"use strict";

const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const middleware = require("./middleware/index.js");
const routeIndex = require('./routes/index');
const routeUpdate = require('./routes/update');
const routeUsers = require('./routes/users');

const app = express();
const port = process.env.PORT || 1337;
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
    cors: {
        origins: ['http://localhost:4200', 'https://www.student.bth.se/'],
        methods: ["GET", "POST", "PUT"],
    }
});

app.use(cors());
//app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Middleware
app.use(middleware.logIncomingToConsole);

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line, 'combined' outputs the Apache style LOGs
    app.use(morgan('combined'));
}

app.use('/me-api', routeIndex);
app.use('/me-api/update', routeUpdate);
app.use('/me-api/users', routeUsers);


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


// Start up the server
const server = httpServer.listen(port, () => console.log(`Me-API listening on port ${port}!`));

module.exports = server;
