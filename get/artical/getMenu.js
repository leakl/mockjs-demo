var cps = require('cps');
var db = require('node-mysql');
var DB = db.DB;

function getMenu(start_id,callback) {
    var box = new DB({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'xiaoshuo',
        connectionLimit: 50,
    })

    var limit = limit || [0,30];
    var sql = 'SELECT `title_id`,`id`,`cai_content_url` FROM `menu` WHERE `cai_status` = 0 ORDER BY `id` DESC LIMIT '+start_id+','+200;
    box.connect(function(conn) {
        cps.seq([
            function(_,callback) {
                conn.query(sql, callback);
            },
            function(res, callback) {
                callback(res)
                box.end();
            }
        ],callback)
    },callback)
}
function setMenuStatus(id,callback) {
   
    var box = new DB({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'xiaoshuo',
        connectionLimit: 50,
    })

    var sql = 'UPDATE `menu` SET cai_status = 1  WHERE `id` ='+id;
    box.connect(function(conn) {
        cps.seq([
            function(_,callback) {
                conn.query(sql, callback);
            },
            function(res, callback) {
                callback(res)
                box.end();
            }
        ],callback)
    },callback)
}
function saveContent(data,callback) {
    var box = new DB({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'xiaoshuo',
        connectionLimit: 50,
    })

    var sql = 'INSERT INTO `article` (title_id,menu_id,content,url) VALUES('+data.title_id+','+data.menu_id+',"'+data.content+'","'+data.url+'")';
    box.connect(function(conn) {
        cps.seq([
            function(_,callback) {
                conn.query(sql, callback);
            },
            function(res, callback) {
                if(res){
                    callback(res)
                    
                }
                box.end();
            }
        ],callback)
    },callback)
}

var Menu ={}
Menu.getMenu=getMenu;
Menu.setMenuStatus=setMenuStatus;
Menu.saveContent=saveContent;
module.exports =Menu;