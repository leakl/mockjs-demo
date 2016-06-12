var express = require('express');
var router = express.Router();
var Mock = require('mockjs');
var path = require('path');


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

  create(function (db_data) {
    var data ={};
    // console.log(db_data)
    data.status = '1';
    data.info = '成功';
    data.list = db_data;
    res.jsonp(data);
  });

});

/* GET article page. */
router.get('/article', function(req, res, next) {
  var data = createArticle();
  data.status = '1';
  data.info = '成功';
  data.data = res;
  res.jsonp(data);
});


/* GET info page. */
router.get('/info/id/:id', function(req, res, next) {
var id = req.params.id;
  info(id,function (db_data) {
    var data ={};
    info_list(id,function (res_list) {
      data.menu_list = res_list;
      data.status = '1';
      data.info = '成功';
      data.list = db_data[0];
      res.jsonp(data);
    })

  });
});





//首页数据
function create(cb) {
  var box = new DB(dbInfo);
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT list.id, list.`class_id`, list.`title`, list.`author`, list.`img`, list.`size`, class.`class_name` FROM `list` LEFT JOIN class ON list.class_id = class.`id` ORDER BY list.`size` DESC LIMIT 0,30', cb);
      },
      function(res, cb) {
        cb(res);
       box.end();
      }
    ], cb);
  }, cb);
}

//首页数据2
function info(id,cb) {
  var box = new DB(dbInfo);
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT list.id,list.`class_id`,list.`title`,list.`author`,list.`jianjie`,list.`img`,list.`size`,list.`add_time`,class.`class_name` FROM `list` LEFT JOIN class ON list.class_id = class.`id` WHERE list.id ='+id , cb);
      },
      function(res, cb) {
        cb(res);
        box.end();
      }
    ], cb);
  }, cb);
}
//首页数据2
function info_list(id,cb) {
  var box = new DB(dbInfo);
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT menu.id,menu.`menu_name` FROM menu LEFT JOIN `list` ON list.id = menu.`title_id` WHERE list.id ='+id+' LIMIT 0,15', cb);
      },
      function(res, cb) {
        cb(res);
        box.end();
      }
    ], cb);
  }, cb);
}


module.exports = router;
