/**
 * Created by andy on 2017/6/11.
 */

//模块依赖
var express = require('express')
    , MongoClient = require('mongodb').MongoClient
    , assert = require('assert');


//构建应用程序
app = express.createServer();

//中间件
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'my secret'}));
//身份验证中间件
app.use(function (req, res, next) {
    if (req.session.logged_in) {
        res.local('authenticated', true);
        app.users.findOne({_id: require('mongodb').ObjectID(req.session.logged_in)}, function (err, doc) {
            if (err) return next(err);
            if (doc) {
                res.local('me', doc);
            }
            next();
        });
    } else {
        res.local('authenticated', false);
        next();
    }
})

//指定视图选项
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

//默认路由
app.get('/', function (req, res) {
    res.render('index');
});

//登录路由
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/login/:signupEmail', function (req, res) {
    res.render('login', {signupEmail: req.params.signupEmail});
});
app.post('/login', function (req, res) {
    app.users.findOne({email: req.body.user.email, password: req.body.user.password}, function (err, doc) {
        if (err) return next(err);
        if (!doc) {
            return res.send('<p>User not found. Go back and try again</p>');
        }
        req.session.logged_in = doc._id.toString();
        res.redirect('/');

    });
});

//登出路由
app.get('/logout', function (req, res) {
    req.session.logged_in = null;
    res.redirect('/');
});

//注册路由
app.get('/signup', function (req, res) {
    res.render('signup');
});
app.post('/signup', function (req, res, next) {
    app.users.insert(req.body.user, function (err, doc) {
        if (err) return next(err);
        res.redirect('/login/' + doc.ops[0].email);
    });
});

//连接数据库
// var server = new mongodb.Server('127.0.0.1', 27017);
// new mongodb.Db('my-website', server).open(function (err, client) {
//     if (err) throw err;
//     console.log('\033[96mconnect to mongodb!\033[39m');
//     app.users = new mongodb.Collection(client, 'users');
// });

var url = 'mongodb://localhost:27017/my-website';

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    app.users = db.collection('users');
    //db.close();
    //建立索引
    db.collection('users').ensureIndex('email', function (err) {
        if (err) throw err;
        db.collection('users').ensureIndex('password', function (err) {
            if (err) throw err;
            console.log('\033[96m ensured index! \033[39m');
        });
    });

});

//监听
app.listen(3000, function () {
    console.log('\033[96mapp listening on 3000 \033[39m');
});


process.on('uncaughtException', function (err) {
    console.log(err);
});