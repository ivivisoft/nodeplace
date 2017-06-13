/**
 * Created by andy on 2017/6/11.
 */

//模块依赖
var mysql = require('mysql')
    , config = require('./config');

//初始化客户端
delete config.database;
var pool = mysql.createPool(config);

//创建数据库database
pool.getConnection(function (err, db) {
    db.query('CREATE DATABASE IF NOT EXISTS `cart-example` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci');
    db.query('USE `cart-example`');

    //创建表
    db.query('DROP TABLE IF EXISTS item');
    db.query('CREATE TABLE item(' +
        'id INT(11) AUTO_INCREMENT,' +
        'title VARCHAR(255),' +
        'description TEXT,' +
        'created DATETIME,' +
        'PRIMARY KEY (id))'
    );
    db.query('DROP TABLE IF EXISTS review');
    db.query('CREATE TABLE review(' +
        'id INT(11) AUTO_INCREMENT,' +
        'item_id INT(11),' +
        'text TEXT,' +
        'stars INT(1),' +
        'created DATETIME,' +
        'PRIMARY KEY (id))'
    );
    //关闭客户端
    db.release(function () {
        process.exit();
    });
});


process.on('uncaughtException', function (err) {
    console.log(err);
});


