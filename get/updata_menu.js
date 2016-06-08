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
                    setTimeout(function () {
                        cb(res);
                    },100)
                }
            ], cb);
        }, cb);

    };

    //
    
    read(data,function (read_res) {
        if(!read_res[0]){ //不存在
            var _sql = 'INSERT INTO menu (title_id,menu_name,cai_content_url) VALUE ('+data.id+',"'+data.menu_name+'","'+data.cai_content_url+'")';
            db_insert_menu(_sql,callback)
            console.log(data.id,data.menu_name)

        }else{
            var msg ='查相同章节存在,id:' +read_res[0].id;
            callback({insertId:read_res[0].id,msg:msg})

        }
    })

}


function read(data,cb2) {
    box.connect(function(conn, cb2) {
        cps.seq([
            function(_, cb2) {
                var sql = 'SELECT id FROM `menu` WHERE `menu_name` = "'+data.menu_name+'" AND `title_id` =' +data.id ;
                conn.query(sql, cb2);
            },
            function(res, cb2) {
                cb2(res);
            }
        ], cb2);
    }, cb2);
}




exports.db_insert_menu_fun = db_insert_menu_fun;