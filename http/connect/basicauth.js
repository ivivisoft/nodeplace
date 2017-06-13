/**
 * Created by andy on 2017/6/8.
 */

var connect = require('connect');

process.stdin.resume();
process.stdin.setEncoding('ascii');

var server = connect(
    connect.basicAuth(function (user, pass, fn) {
        cosole.log('\033[96m ' + user + ' \033[39m with pass \033[90m' + pass + ' \033[39m ');
        process.stdout.write('Allow user \033[96m ' + user + ' \033[39m with pass \033[90m' + pass + ' \033[39m ? [Y/n]: ');
        process.stdin.once('data', function (data) {
            if (data[0] == 'Y') {
                fn(null, {username: user});
            } else {
                fn(new Error('Unauthorized'));
            }
        });
    })
    , function (req, res) {
        res.writeHead(200);
        res.end('Welcome to the protected area,' + req.remoteUser.username);
    }
);
server.listen(3000);

