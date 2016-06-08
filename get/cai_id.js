/**
 * Created by nick on 2016/6/8.
 */

var cps = require('cps');
var db = require('node-mysql');
var DB = db.DB;


var box = new DB({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'xiaoshuo',
    connectionLimit: 50,
})

//采集进度记录
var cai_save_id =function (id,type,callback1) {
    if(!id) return;
    if(type == 'list'){
        var sql = 'UPDATE `cai_id` SET `cai_id_list` =' +id;
        saveDB(sql,function () {
            console.log('保存LIST进度成功',id)
            callback1()
        })
    }else if(type =='menu'){
        var sql = 'UPDATE `cai_id` SET `cai_id_menu` =' +id;
        saveDB(sql,function () {
            console.log('保存menu进度成功',id)
            callback1()
        })
    }


}
function saveDB(sql,callback) {
    box.connect(function(conn) {
        cps.seq([
            function(_,callback) {
                conn.query(sql, callback);
            },
            function(res, callback) {
                callback(res)
            }
        ],callback)
    },callback)

}

module.exports = cai_save_id
