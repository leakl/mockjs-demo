/**
 * Created by nick on 2016/6/2.
 */
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var urls = require('../get/m-info.json');
var num = 105;
var baseUrl = urls[num];
var updata = require('../get/updata_list.js');
var insert_menu = require('../get/updata_menu.js');

function one(url) {
    var dataAyy ={};
    dataAyy.info={};
    dataAyy.list=[];
    http.get(url, function(res) {
        var bufferHelper = new BufferHelper();
        res.on('data', function(chunk){
            bufferHelper.concat(chunk);
        });
        res.on('end', function(error){
            console.log(error)
            if(error){return}
            var result = iconv.decode(bufferHelper.toBuffer(),'gbk');
            resolveHtml(result)

        });

    })


    function resolveHtml(result){
       var $ = cheerio.load(result);
        var _data ={}
        _data.img =  $('meta').eq(12).attr('content');
        _data.jianjie = $('meta').eq(11).attr('content')||'没有简介了';
        _data.size = size($('#info').children('p').eq(2).text());
        dataAyy.info = _data;
        list(result)
    }

    function list(result) {
        var $ = cheerio.load(result);
        var dom = $('#list dd');
        for(var i =0;i<dom.length;i++){
            var href = $(dom[i]).children('a').attr('href');
            if(!href){
                continue;
            }
            var _data ={}
            _data.menu_name =  $(dom[i]).text();

            _data.cai_content_url = baseUrl + href;
            dataAyy.list.push(_data);
        }
        // console.log(dataAyy.info)
        // save(JSON.stringify(dataAyy,null,4))
        save(dataAyy)
    }

    function save(dataAyy) {
       updata.list_info_fun(dataAyy,urls[num],function (res) {
           var _i = 0,_menu_list = dataAyy.list;
           console.log('写入标题成功，返id：',res.id)
           if(res.status){
               var leng = _menu_list.length<200?_menu_list.length:200;
               _add_menu =function () {
                   var _data = {}
                   _data.id = res.id;
                   if(_menu_list[_i].menu_name){
                       _data.menu_name = _menu_list[_i].menu_name;
                       _data.cai_content_url = _menu_list[_i].cai_content_url;
                       insert_menu.db_insert_menu_fun(_data,function (res3) {
                           console.log('增加章节')
                           if(_i<leng){
                               _i++;
                               _add_menu();
                           }else{
                               if(num<urls.length && res.status){
                                   setTimeout(function () {
                                       num++;
                                       one(urls[num]);
                                   },1000)
                               }else{
                                   console.log('OK')
                                   box.end();
                               }
                           }
                       });
                   }

               }
               _add_menu()

           }


       });
    }
}
one(baseUrl);

function size(string) {
    string = string.match(/共(\d+)万字/)[1];
    return string;
}
