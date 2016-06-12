var express = require('express');
var router = express.Router();
var cps = require('cps');
var db = require('node-mysql');
var DB = db.DB;


var dbInfo ={
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'xiaoshuo',
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = {status:0,info:'成功',list:[]}
    getTitle(function(db_res){
         if(db_res){
             data.list =JSON.parse(JSON.stringify(db_res));
         }else{
             data = {status:1,info:'失败',list:[]}
         }
         res.render('index', data);
     })
});

/* GET list page. */
router.get('/list_id/:id', function(req, res, next) {
    var title_id = req.params.id;
    console.log('列表',title_id)
    var data = {status:0,info:'成功',list:[]}
     getList(title_id,function(db_res){
         if(db_res){
             data.list =JSON.parse(JSON.stringify(db_res));
         }else{
             data = {status:1,info:'失败',list:[]}
         }
         res.render('list', data);
     })
});


//内容
router.get('/detail_id/:id', function(req, res, next) {
    var id = req.params.id;
    console.log('id:',id)
    var data = {status:0,info:'成功',content:[]}
    getDetial(id,function(db_res){
        if(db_res){
            data.content =JSON.parse(JSON.stringify(db_res));

        }else{
            data = {status:1,info:'失败',content:[]}
        }
        res.render('detail', data);
    })
});





//首页数据
function getTitle(cb) {
  var box = new DB(dbInfo);
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT list.id,class.`class_name`,list.`title`,list.`author`,list.`img` FROM `list` LEFT JOIN class ON list.`class_id` = class.`id` LEFT JOIN menu ON menu.`title_id` = list.id  WHERE menu.`cai_status` = 1 GROUP BY list.`id`', cb);
      },
      function(res, cb) {
        cb(res);
        box.end();
      }
    ], cb);
  }, cb);
}

//章节
function getList(title_id,cb) {
  var box = new DB(dbInfo);
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT * FROM `menu` WHERE  title_id = '+title_id+' LIMIT 0,30', cb);
      },
      function(res, cb) {
        cb(res);
        box.end();
      }
    ], cb);
  }, cb);
}

//内容
function getDetial(id,cb) {
    var box = new DB(dbInfo);
    box.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                conn.query('SELECT menu.`menu_name`, article.`content` FROM `article` LEFT JOIN `menu` ON menu.`id` = article.`menu_id` WHERE menu.id = '+id , cb);
            },
            function(res, cb) {
                cb(res);
                box.end();
            }
        ], cb);
    }, cb);
}

module.exports = router;
