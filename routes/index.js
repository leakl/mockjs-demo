var express = require('express');
var router = express.Router();
var Mock = require('mockjs');
var Random = Mock.Random;


var cps = require('cps');
var db = require('node-mysql');
var DB = db.DB;

var box = new DB({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'xiaoshuo',
  connectionLimit: 50,
});



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
  info(function (db_data) {
    var data ={};
    // console.log(db_data)
    data.status = '1';
    data.info = '成功';
    data.list = db_data[0];
    res.jsonp(data);
  });
});




//生成数据
function createArticle() {
  var data = Mock.mock({

      title: function () {
        return Random.ctitle(5,20)
      },
      author: function () {
        return Random.ctitle(2,6)
      },
      content: function () {
        return Random.cparagraph(20,60)
      },
      time: function () {
        return Random.now('yyyy-MM-dd HH:mm:ss')
      }


  })
  return data
}

//生成数据
function create2() {
  var data = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|10-35': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1,
      title: function () {
        return Random.ctitle(5,20)
      },
      author: function () {
        return Random.ctitle(2,6)
      },
      size: function () {
        return Random.natural(100,9999)
      },
      time: function () {
        return Random.now('yyyy-MM-dd HH:mm:ss')
      },
      img:function () {
        return Random.image('50x70', '#f5f5f5')
      }
    }]
  })
  return data
}


//首页数据
function create(cb) {
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT id,title,author,img FROM list limit 0,30', cb);
      },
      function(res, cb) {
        cb(res);
        box.end();
      }
    ], cb);
  }, cb);
}

//首页数据
function info(cb) {
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT list.id,list.`class_id`,list.`title`,list.`author`,list.`jianjie`,list.`img`,list.`size`,list.`tuijian`,class.`class_name` FROM LIST LEFT JOIN class ON list.class_id = class.`id` WHERE list.id = "4"', cb);
      },
      function(res, cb) {
        cb(res);
      }
    ], cb);
  }, cb);
}


module.exports = router;
