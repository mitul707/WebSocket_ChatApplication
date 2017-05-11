var express = require('express');
var app = express();

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;

var users = [];

console.log('Server is running...!!!');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

io.sockets.on('connection', function(socket) {
    console.log('Connected');

    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username),1);
        io.sockets.emit('user removed', users, socket.username);
    })

    socket.on('message', function(data) {
        io.sockets.emit('new-message', data, socket.username);
    })

    socket.on('new user', function(data) {
        socket.username = data;
        users.push(data);
        io.sockets.emit('user added', users, socket.username);
    })
})

server.listen(port);