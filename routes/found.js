var express = require('express');
var router = express.Router();
var cps = require('cps');
var db = require('node-mysql');
var DB = db.DB;


/* GET home page. */
router.get('/', function(req, res, next) {
     var data =''
     getList(function(res){
         var data = {status:0,info:'成功',list:[]}
         if(res){
             data.list =res;
         }else{
             data = {status:1,info:'失败',list:[]}
         }
         
         
     })
      
     res.render('index', data);
   
});

//生成数据var db = require('node-mysql');


var dbInfo ={
  host     : 'location',
  user     : 'root',
  password : '',
  database : 'xiaoshuo',
}

//首页数据2
function getList(cb) {
  var box = new DB(dbInfo);
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT id,title_id,add_time,url FROM article order by id desc LIMIT 0,5', cb);
      },
      function(res, cb) {
        cb(res);
        box.end();
      }
    ], cb);
  }, cb);
}

module.exports = router;
