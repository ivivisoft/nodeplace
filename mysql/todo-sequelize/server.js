/**
 * Created by andy on 2017/6/12.
 */

//模块依赖
var express = require('express')
    , Sequelize = require('sequelize');

//初始化sequelize
var sequelize = new Sequelize('todo-example', 'root', 'study', {host: 'localhost', dialect: 'mysql'});

//认证数据库sequelize.authenticate().complete()回调函数用来验证是否连接数据库成功
sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully.');
}).catch(function (err) {
    console.error('Unable to connect to the database:', err);
});

//定义模型和同步
var Project = sequelize.define('Project', {
    title: Sequelize.STRING
    , description: Sequelize.TEXT
    , created: Sequelize.DATE
});

//定义任务模型
var Task = sequelize.define('Task', {
    title: Sequelize.STRING
});
//设置联合
Task.belongsTo(Project);
Project.hasMany(Task);

//同步Schema到数据库
sequelize.sync();

//创建应用
app = express.createServer();

//配置应用
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

//配置中间件
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

//首页路由
app.get('/', function (req, res, next) {
    Project.findAll().then(function (projects) {
        res.render('index', {projects: projects});
    }).error(next);
});

//删除项目路由
app.del('/project/:id', function (req, res, next) {
    Project.findById(Number(req.params.id)).then(function (proj) {
        proj.destroy().then(function () {
            res.send(200);
        }).error(next);
    }).error(next);
});

//创建项目路由
app.post('/projects', function (req, res, next) {
    Project.build(req.body).save().then(function (obj) {
        res.send(obj);
    }).error(next);
});

//展示指定项目中的任务
app.get('/project/:id/tasks', function (req, res, next) {
    Project.findOne({where: {id: Number(req.params.id)}, include: [Task]}).then(function (project) {
        res.render('tasks', {project: project, tasks: project.Tasks});
    }).error(next);
});

//为指定的项目添加任务
app.post('/project/:id/tasks', function (req, res, next) {
    req.body.ProjectId = req.params.id;
    Task.build(req.body).save().then(function (obj) {
        res.send(obj);
    }).error(next);
});
//删除任务
app.del('/task/:id', function (req, res, next) {
    Task.findById(Number(req.params.id)).then(function (task) {
        task.destroy().then(function () {
            res.send(200);
        }).error(next);
    }).error(next);
});


//监听
app.listen(3000, function () {
    console.log(' - listening on http://*:3000');
});

process.on('uncaughtException', function (err) {
    console.log(err);
});
