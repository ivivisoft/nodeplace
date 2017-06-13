/**
 * Created by andy on 2017/6/4.
 */



var net = require('net');

var count = 0,
    users = [];


var server = net.createServer(function (conn) {
    //handle connections
    console.log('\033[90m new Connection!\033[39m');
    conn.write('\n > welcome to \033[92mnode-chat \033[39m!'
        + '\n > ' + count + ' other people are connected at this time.'
        + '\n > please write your name and press enter:');
    count++;
    conn.setEncoding('utf-8');
    //代表当前连接的用户昵称
    var nickname;
    conn.on('data', function (data) {

        //删除回车符
        data = data.toString().replace('\r\n', '');
        if (!data) {
            return;
        }
        if (!nickname) {
            if (users[data]) {
                conn.write('\033[93m> nickname already in use.try again:\033[39m');
                return;
            } else {
                nickname = data;
                users[nickname] = conn;
                broadcast('\033[90m > ' + nickname + ' joined the room\033[39m\n');
            }
        } else {
            //否则视为聊天信息
            broadcast('\033[96m > ' + nickname + ' :\033[39m' + data + '\n', true);
        }
        console.log(data.toString())
    });
    conn.on('close', function () {
        count--;
        delete users[nickname];
        broadcast('\033[90m > ' + nickname + ' left the room\033[39m\n');
    });


    function broadcast(msg, exceptMyself) {
        for (var i in users) {
            if (!exceptMyself || i != nickname) {
                users[i].write(msg);
            }
        }
    }
});


server.listen(3000, function () {
    console.log('\033[96m server listening on *:3000\033[39m');
});
