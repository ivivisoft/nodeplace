/**
 * Created by andy on 2017/6/9.
 */


var express = require('express')
    , wsio = require('websocket.io');

//create express app
var app = express.createServer();
//attach websocket server
var ws = wsio.attach(app);
//serve your code
app.use(express.static(__dirname + '/public'));


var postitions = {}
    , total = 0;
//listening on connections
ws.on('connection', function (socket) {
    //you give the socket an id
    socket.id = ++total;
    //you send the postions of everyone else
    socket.send(JSON.stringify(postitions));

    socket.on('message', function (msg) {
        try {
            var pos = JSON.parse(msg);
        } catch (e) {
            return;
        }
        postitions[socket.id] = pos;
        broadcast(JSON.stringify({type: 'position', pos: pos, id: socket.id}));
    });
    socket.on('close', function () {
        delete postitions[socket.id];
        broadcast(JSON.stringify({type: 'disconnect', id: socket.id}));
    });
    function broadcast(msg) {
        for (var i = 0, l = ws.clients.length; i < l; i++) {
            //you avoid sending a message to the same socket that broadcasts
            if (ws.clients[i] && socket.id != ws.clients[i].id) {
                //you call 'send' on the other clients

                ws.clients[i].send(msg);
            }
        }
    }
});

app.listen(3000);

