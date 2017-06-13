/**
 * Created by andy on 2017/6/7.
 */


var connect = require('connect');
var time = require('./request-time');
var fs = require('fs');



var server = connect.createServer();

server.use(connect.logger(':method :remote-addr and it took :response-time ms.'));
//server.use(time({time:500}));

/**
 * 添加静态托管文件中间件
 * 这样访问就好了http://localhost:3000/4.jpg
 */
server.use(connect.static(__dirname + '/images'));


server.use(connect.query());
server.use(connect.bodyParser());

server.use(function (req, res, next) {
    if ('POST' == req.method && req.files) {
        console.log(req.body.file);

        fs.readFile(req.files.file.path, 'utf-8', function (err, data) {
            if (err) {
                res.writeHead(500);
                res.end('Error!');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html', 'Charset': 'utf-8'});
            res.end([
                '<meta charset="UTF-8"/>'
                ,'<h3>File: ' + req.files.file.name + '</h3>'
                , '<h4>Type: ' + req.files.file.type + '</h4>'
                , '<h4>Contents:</h4><pre>' + data + '</pre>'
            ].join(''));
        });


        // res.writeHead(200);
        // res.end('Files!');
    } else {
        next();
    }
});

/**
 * 快速响应
 */
server.use(function (req, res, next) {
    var url = req.url.split('?')[0];
    if ('/a' == url) {
        console.log(req.query.name);
        res.writeHead(200);
        res.end('Fast!');
    } else {
        next();
    }
});

/**
 * 慢速响应
 */
server.use(function (req, res, next) {
    if ('/b' == req.url) {
        setTimeout(function () {
            res.writeHead(200);
            res.end('Slow!');
        }, 1000);
    } else {
        next();
    }
});
server.listen(3000);
