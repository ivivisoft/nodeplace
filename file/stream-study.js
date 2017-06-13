/**
 * Created by andy on 2017/6/4.
 */


var fs = require('fs');

var astream = fs.createReadStream('my-file.txt');
astream.on('data', function (chunk) {
    //处理文件内容
    console.log(chunk.toString());
});
astream.on('end', function () {
    //文件读取完毕
    console.log('The file is reading end!')
});

//获取工作目录下所有的文件
var files = fs.readdirSync(process.cwd());
files.forEach(function (file) {
    //监听".css"后缀的文件
    if (/\.css/.text(file)) {
        fs.watchFile(process.cwd() + '/' + file, function () {
            console.log(' - ' + file + ' changed!');
        });
    }
});
