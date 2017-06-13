/**
 * Created by andy on 2017/6/9.
 */

var express = require('express')
    , sio = require('socket.io')
    , request = require('superagent');


var app = express.createServer();
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.error(function (err, req, res, next) {
    if (err) {
        console.log(err.message);
    } else {
        next();
    }
})
app.listen(3000);


var io = sio.listen(app)
    , apiKey = '{your API key}'
    , currentSong
    , dj;

function elect(socket) {
    dj = socket;
    io.sockets.emit('announcement', socket.nickname + ' is the new dj');
    socket.emit('elected');
    socket.dj = true;
    socket.on('disconnect', function () {
        dj = null;
        io.sockets.emit('announcement', 'the dj left -- next one to join becomes dj');
    });
}

io.sockets.on('connection', function (socket) {
    socket.on('join', function (name) {
        if (!name) {
            return
        }
        console.log(name + ' connected!');
        socket.nickname = name;
        socket.broadcast.emit('announcement', name + ' joined the chat.');
        if (!dj) {
            elect(socket);
        } else {
            socket.emit('song', currentSong);
        }
    });
    socket.on('song', function (song) {
        if (socket.dj) {
            currentSong = song;
            socket.broadcast.emit('song', song);
        }
    });
    socket.on('search', function (q, fn) {
        try {
            request('http://tinysong.com/s/' + encodeURIComponent(q) + '?key=' + apiKey + '&format=json', function (res) {
                if (200 == res.status) {
                    fn(JSON.parse(res.text));
                }
            });
        } catch (error) {
            console.log(error);
        }
    });
    socket.on('text', function (msg, fn) {
        socket.broadcast.emit('text', socket.nickname, msg);
        //确认消息已接收
        fn(Date.now());
    });
});

process.on('uncaughtException', function (err) {
    console.log(err);
});