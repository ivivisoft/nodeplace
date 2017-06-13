/**
 * Created by andy on 2017/6/11.
 */

//模块依赖
var expres = require('express')
    , mysql = require('mysql')
    , config = require('./config');

//创建应用
app = expres.createServer();

//数据库
var pool = mysql.createPool(config);

//配置应用
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

//中间件
app.use(expres.bodyParser());

//首页路由
app.get('/', function (req, res, next) {
    pool.getConnection(function (err, conn) {
        conn.query('SELECT id,title,description FROM item', function (err, results) {
            res.render('index', {items: results});
        })
    });
});

//创建商品路由
app.post('/create', function (req, res, next) {
    pool.getConnection(function (err, conn) {
        conn.query('INSERT INTO item set title = ?,description = ?', [req.body.title, req.body.description], function (err, info) {
            if (err)return next(err);
            console.log(' - item created with id %s', info.insertId);
            res.redirect('/');
        });
        conn.release();
    });
});
//查看商品路由
app.get('/item/:id', function (req, res, next) {
    function getItem(fn) {
        pool.getConnection(function (err, conn) {
            conn.query('SELECT id,title,description FROM item WHERE id = ? LIMIT 1', [req.params.id], function (err, results) {
                if (err)return next(err);
                if (!results[0]) return res.send(404);
                fn(results[0]);
            });
            conn.release();
        });
    }

    function getReviews(item_id, fn) {
        pool.getConnection(function (err, conn) {
            conn.query('SELECT text,stars FROM review WHERE item_id=?', [item_id], function (err, results) {
                if (err)return next(err);
                if (!results) return res.send(404);
                fn(results);
            });
            conn.release();
        });
    }

    getItem(function (item) {
        getReviews(item.id, function (reviews) {
            res.render('item', {item: item, reviews: reviews});
        });
    });
});
//创建商品评价路由
app.post('/item/:id/review', function (req, res, next) {
    pool.getConnection(function (err, conn) {
        conn.query('INSERT INTO review SET item_id = ?,stars = ?,text = ?', [req.params.id, req.body.stars, req.body.text], function (err, info) {
            if (err)return next(err);
            console.log(' - review created with id %s', info.insertId);
            res.redirect('/item/' + req.params.id);
        });
        conn.release();
    });
});
//监听
app.listen(3000, function () {
    console.log(' - listening on http://*:3000');
});

process.on('uncaughtException', function (err) {
    console.log(err);
});


