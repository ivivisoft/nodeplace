/**
 * Created by andy on 2017/6/9.
 */


var express = require('express')
    , wsio = require('websocket.io');


//Create express app.
var app = express.createServer();

//Attach websocket server.
var ws = wsio.attach(app);

//Server your code
app.use(express.static(__dirname + '/public'));

//Listening on connections
ws.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log(' \033[96mgot: \033[39m ' + msg);
        socket.send('pong');
    })
});

//Listen
app.listen(3000);
