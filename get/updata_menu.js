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


function db_insert_menu_fun(data,callback) {
    var db_insert_menu = function(sql,cb) {
        box.connect(function(conn, cb) {
            cps.seq([
                function(_, cb) {
                    conn.query(sql, cb);
                },
                function(res, cb) {
                    cb(res);
                }
            ], cb);
        }, cb);
    };
    var _sql = 'INSERT INTO menu (title_id,menu_name,cai_content_url) VALUE ('+data.id+',"'+data.menu_name+'","'+data.cai_content_url+'")';
    console.log(_sql)
    db_insert_menu(_sql,callback)
}

exports.db_insert_menu_fun = db_insert_menu_fun;