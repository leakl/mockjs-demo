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

var db_list = function(cb) {
    box.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                conn.query('SELECT list.id,list.`class_id`,class.class_name,list.`title`,list.`author`,list.`size` FROM LIST LEFT JOIN class ON class.id =list.class_id; ', cb);
            },
            function(res, cb) {
                cb(res);
            }
        ], cb);
    }, cb);
};

/*
 //读列表
 db_list(function (res) {
 console.log(res);
 })
 */


var db_class = function(cb) {
    box.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                conn.query('SELECT class.* FROM class; ', cb);
            },
            function(res, cb) {
                cb(res);
            }
        ], cb);
    }, cb);
};
/*

 db_class(function (res) {
 console.log('分类',res)
 })
 */



//写入分类
var db_insert_class = function(cb) {
    box.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                conn.query('INSERT INTO class (class_name) VALUE ("玄幻"),("人民")', cb);
            },
            function(res, cb) {
                cb(res);
            }
        ], cb);
    }, cb);
};
/*
 db_insert_class(function (res) {
 console.log(res)
 console.log(res.insertId)
 })*/
function list_fun() {

    var db_insert_list = function(data,cb) {
        box.connect(function(conn, cb) {
            cps.seq([
                function(_, cb) {
                    conn.query('INSERT INTO list (class_id,title,author,size,jianjie,tuijian,read_num,cai_menu_url) VALUE ' + data + '', cb);
                },
                function(res, cb) {
                    cb(res);
                }
            ], cb);
        }, cb);
    };
    var da = require('../get/m.json');
    var ds= '';
    for(var i=0;i<da.length;i++){
        var data=[];
        data[0] = da[i].class_id
        data[1] = '"'+da[i].title+'"'
        data[2] = '"'+da[i].author+'"'
        data[3] = 1
        data[4] = '"没有简介"'
        data[5] = da[i].id
        data[6] = 1
        data[7] = '"'+da[i].url+'"'
        var str = '('+data.join(',')+')'

        // ds +=str+',';
        db_insert_list(str,function (res) {
            console.log(res)
        })
    }
}

function list_info_fun() {
    var i = 0;
    var db_insert_list = function(sql,cb) {
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
    var list_info = require('../get/m-list.json');
    var list_list= require('../get/m-info.json');

    // UPDATE LIST SET read_num=10 WHERE cai_menu_url="http://www.biqugex.com/book_4146/";
    var _sql = 'UPDATE LIST SET jianjie="'+list_info.info.jianjie+'",size="'+list_info.info.size+'",img="'+list_info.info.img+'" WHERE cai_menu_url="'+list_list[0]+'"';

    db_insert_list(_sql,function (res) {console.log(res)})

}
list_info_fun()