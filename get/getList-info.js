/**
 * Created by nick on 2016/6/2.
 */
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var urls = require('../get/m-info.json');
var num = 238;
var baseUrl = urls[num];
var updata = require('../get/updata_list.js');
// var insert_menu = require('../get/updata_menu.js');
var requestWithTimeout = require('../get/http_timeout.js');
var cai_save_id = require('../get/cai_id.js');
var resGetNum = 0;

var cps = require('cps');
var db = require('node-mysql');
var DB = db.DB;
var dataAyy = {};
var timeout = false;
function one(url) {

    dataAyy.info = {};
    dataAyy.list = [];
  //  cai_save_id(num, 'list', function () {

        var req = requestWithTimeout(url, 10000, function (res) {
            var bufferHelper = new BufferHelper();
            res.on('data', function (chunk) {
                bufferHelper.concat(chunk);

            });
            res.on('end', function (res) {
                if(!timeout){
                var result = iconv.decode(bufferHelper.toBuffer(), 'gbk');
                    console.log('end --')
                    resolveHtml(result)
                }

            })
        });

        req.on('error', function (e) {
            console.log('error got :' + e.message);
        }).on('timeout', function (e) {
            timeout =true;
            console.log('timeout got :' + e.message);

            if (resGetNum >= 3) {
                num++;
                console.log('上一条超时,准备一下list', urls[num], 'num:', num);
                resGetNum = 0;

            } else {
                resGetNum++;
                console.log('连接超时,重新获取', urls[num], 'num:', num);
            }
            var i = 15, _t;
            _t = setInterval(function () {
                console.log('等' + i + '秒重试');
                i--;
                if (i <= 0) {
                    clearInterval(_t);
                    timeout =false
                    one(urls[num]);
                }
            }, 1000)


        })

  //  });


    function resolveHtml(result) {
        var $ = cheerio.load(result);
        var _data = {}
        _data.img = $('meta').eq(12).attr('content');
        _data.jianjie = $('meta').eq(11).attr('content') || '没有简介了';
        _data.size = size($('#info').children('p').eq(2).text());
        dataAyy.info = _data;
        list(result)
    }

    function list(result) {
        var $ = cheerio.load(result);
        var dom = $('#list dd');
        for (var i = 0; i < dom.length; i++) {
            var href = $(dom[i]).children('a').attr('href');
            if (!href) {
                continue;
            }
            var _data = {}
            _data.menu_name = $(dom[i]).text();

            _data.cai_content_url = urls[num] + href;
            dataAyy.list.push(_data);
        }
        console.log(dataAyy.list[0].cai_content_url,99011)
        save(dataAyy)

    }


    function save(dataAyy) {
        updata.list_info_fun(dataAyy, urls[num], function (res) {
            if (!res.id) {
                console.log(res, 1111111111111111)
            }
            if (res.status) {
                var _data = dataAyy.list;
                console.log('共有', _data.length + '数据');
                if (_data.length < 1) {
                    console.log('没有目录数据')
                    return
                }
                console.log(urls[num], _data[0].cai_content_url);
                if (_data[0].cai_content_url.indexOf(urls[num]) < 0) {
                    console.log('章节不匹配 stop');
                    return;
                }


                //写入目录///////////////////////////////////////////////////////////////////////////////////
                var menu_sql = 'INSERT INTO menu (title_id,menu_name,cai_content_url) VALUE';
                //组装menu_sql
                //'INSERT INTO menu (title_id,menu_name,cai_content_url) VALUE ('+data.id+',"'+data.menu_name+'","'+data.cai_content_url+'")';
                for (var i = 0; i < _data.length; i++) {
                    if (i == _data.length - 1) {
                        menu_sql += '(' + res.id + ',"' + _data[i].menu_name + '","' + _data[i].cai_content_url + '")'
                    } else {
                        menu_sql += '(' + res.id + ',"' + _data[i].menu_name + '","' + _data[i].cai_content_url + '"),'
                    }
                }

                function insert_menu(menu_sql, menu_cb) {
                    var box = new DB({
                        host: 'localhost',
                        user: 'root',
                        password: '',
                        database: 'xiaoshuo',
                        connectionLimit: 50,
                    });
                    box.connect(function (conn, menu_cb) {
                        cps.seq([
                            function (_, menu_cb) {
                                conn.query(menu_sql, menu_cb);
                            },
                            function (menu_res, menu_cb) {
                                menu_cb(menu_res);
                                box.end();

                            }
                        ], menu_cb);
                    }, menu_cb);
                }


//写入目录///////////////////////////////////////////////////////////////////////////////////


                function hasMenu(hasMenu_sql,hasMenu_cb) {
                    var box = new DB({
                        host: 'localhost',
                        user: 'root',
                        password: '',
                        database: 'xiaoshuo',
                        connectionLimit: 50,
                    });
                    box.connect(function (conn, hasMenu_cb) {
                        cps.seq([
                            function (_, hasMenu_cb) {
                                conn.query(hasMenu_sql, hasMenu_cb);
                            },
                            function (hasMenu_res, hasMenu_cb) {
                                hasMenu_cb(hasMenu_res);
                                box.end();
                            }
                        ], hasMenu_cb);
                    }, hasMenu_cb);
                }
                var _resid =res.id;
                var hasMenu_sql ='SELECT COUNT(1) FROM menu WHERE title_id ='+_resid;
                hasMenu(hasMenu_sql,function (res) {
                    console.log(res[0])
                    if(res[0]['COUNT(1)'] < 1){
                        insert_menu(menu_sql, function (res) {
                            console.log(res.affectedRows, '写入条记录 id:', _resid)
                            if (res) {
                                nextList();
                            }
                        })
                    }else{
                        //有重复menu
                        console.log('有重复menu id',res.id)
                        nextList();

                    }
                })
                //查重复 end
            }

        });
        //写入list end
    }
}
one(baseUrl);

function size(string) {
    if (string) {
        if (/共(\d+)万字/.test(string)) {
            string = string.match(/共(\d+)万字/)[1];
        } else {
            string = '0'
        }
    } else {
        string = '0'
    }

    return string;
}

function nextList() {
    console.log('2秒,下一条list记录')

    setTimeout(function () {
        num++;
        dataAyy ={};
        timeout =false
        one(urls[num])
    }, 2000)

}
