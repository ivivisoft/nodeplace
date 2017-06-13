/**
 * Created by andy on 2017/6/6.
 */

var http = require('http');
var qs = require('querystring');


require('http').request({
    host: 'localhost'
    , port: 3000
    , url: '/'
    , method: 'GET'
}, function (res) {
    var body = '';
    res.setEncoding('utf-8');
    res.on('data', function (chunk) {
        body += chunk;
    });
    res.on('end', function () {
        console.log('\n We got: \033[96m' + body + '\033[39m');
    });
}).end();


function send(theName) {
    http.request({
        host: 'localhost'
        , port: 3000
        , url: '/form'
        , method: 'POST'
    }, function (res) {
        var body = '';
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log('\n \033[90mrequest complete!\033[39m');
            process.stdout.write('\n your name:');
        });
    }).end(qs.stringify({name: theName}));
}
function test() {
    process.stdout.write('\n your name:');
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', function (name) {
        console.log(name.toString());
        send(name.toString());
    });
}

test();
