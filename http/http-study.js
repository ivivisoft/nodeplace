/**
 * Created by andy on 2017/6/4.
 */


/**
 * 配合up使用,以备热发布,有利于开发
 * 注意:1.把服务暴露出去.2不需要了listen方法.
 * 启动方法是: up -w -p 8080 http-study.js 即可
 */
module.exports = require('http').createServer(function (req, res) {
    if ('/' == req.url && 'GET' == req.method) {
        res.writeHead(200);
        res.end('Hello Andy');
    } else if ('/form' == req.url && 'POST' == req.method) {
        var body = '';
        req.setEncoding('utf-8');
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            console.log('\033[90m ' + require('querystring').parse(body).name + '\033[39m\n');
            res.writeHead(200);
            res.end('ok');
        });

    } else {
        res.writeHead(404);
        res.end('Not Found!');
    }
});
