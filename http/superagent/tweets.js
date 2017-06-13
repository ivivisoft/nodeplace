/**
 * Created by andy on 2017/6/7.
 */


var request = require('superagent');
var qs = require('querystring');

request.post('http://localhost:3000/form').send(qs.stringify({name: 'andy'})).end(function (err,res) {
    console.log(res.body);
});