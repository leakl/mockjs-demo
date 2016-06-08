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

function list_info_fun(list_info,cai_menu_url,callback) {
    var i = 0;
    var db_insert_list = function(sql,cb) {
        box.connect(function(conn, cb) {
            cps.seq([
                function(_, cb) {
                    conn.query(sql, cb);
                },
                function(res, cb) {
                    if(!res){
                        console.log(res,999999)
                    }
                    if(res.affectedRows == 1){
                        var getID = function(cb2) {
                                cps.seq([
                                    function(_, cb2) {
                                        conn.query('SELECT id FROM list WHERE cai_menu_url = "'+cai_menu_url+'"',cb2);
                                    },
                                    function(res2, cb2) {
                                        cb2(res2);
                                    }
                                ], cb2);
                        };
                        getID(function (res2) {
                            if(res2){
                                cb({"status":1,"id":res2[0].id});
                               // box.end();
                            }

                        })



                    }else {
                        cb({"status":0});
                    }
                }
            ], cb);
        }, cb);
    };
;

    // UPDATE LIST SET read_num=10 WHERE cai_menu_url="http://www.biqugex.com/book_4146/";
    var _sql = 'UPDATE LIST SET jianjie="'+list_info.info.jianjie+'",size="'+list_info.info.size+'",img="'+list_info.info.img+'" WHERE cai_menu_url="'+cai_menu_url+'"';
    console.log(_sql)
    db_insert_list(_sql,callback)

}
exports.list_info_fun = list_info_fun;