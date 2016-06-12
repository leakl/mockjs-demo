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

router.get('/id/:id', function(req, res, next) {
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

//生成数据var db = require('node-mysql');



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
