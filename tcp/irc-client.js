/**
 * Created by andy on 2017/6/5.
 */



var client =require('net').createConnection(6667,'webchat.freenode.net');
client.setEncoding('utf-8');
client.on('connect',function () {
    client.write('NICK mynick\r\n');
    client.write('USER ,mynick 0 * :realname\r\n');
    client.write('JOIN #node.js\r\n');
});
