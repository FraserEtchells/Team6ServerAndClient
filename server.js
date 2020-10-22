//Quiz Server Lobby
//Ross Mitchell and Melvin Abraham

// const { Console } = require('console');
// const path = require('path');
// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

const port = process.env.port || 4000;

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var mongo = require('mongodb');
var assert = require('assert');
var cors = require('cors');

var url='mongodb://team6-mongodb:4LITWMsMLAzi1w4rZbuOo0wgaaUlFk0nO3WMj1riXjsnL0rkZqmRgeX0oVnWTHOhlOgr7NX6H97S00pwfgWxlA==@team6-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@team6-mongodb@'


const app = express();
const server = http.createServer(app);

app.use(cors());

// Set static folder

/*app.use(express.static(path.join(__dirname, "build")));*/

app.get('/', (req, res) => {
    var today = new Date()

    res.send(today)
})

console.log("Listening on port: " +  port );
server.listen(port)

const io = socketio.listen(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});
