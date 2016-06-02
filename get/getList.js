/**
 * Created by nick on 2016/6/2.
 */
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var baseUrl = 'http://www.biqugex.com';

// var url = baseUrl+'/kehuanxiaoshuo/'
// var url = baseUrl+'/xuanhuanxiaoshuo/'
// var url = baseUrl+'/xianxiaxiaoshuo/'
// var url = baseUrl+'/lishixiaoshuo/'
var url = baseUrl+'/dushixiaoshuo/'
http.get(url, function(res) {
    var size = 0;
    var chunks = [];
    var bufferHelper = new BufferHelper();
    res.on('data', function(chunk){
        bufferHelper.concat(chunk);
    });

    res.on('end', function(){
        var result = iconv.decode(bufferHelper.toBuffer(),'gbk');
        resolveHtml(result)
    });
})

var list = []
function resolveHtml(data){
    $ = cheerio.load(data);
    var listDom = $('#newscontent .r li');
    for(var i =0;i<listDom.length;i++){
        var d =$(listDom[i]);
        var _data ={}
        _data.id = i;
        _data.class =  d.children('span').eq(0).text();
        _data.class_id =  getClass(_data);
        _data.title = d.children('span').eq(1).text()
        _data.author = d.children('span').eq(2).text()
        _data.url =baseUrl + d.children('span').children('a').attr('href');
        list.push(_data)
    }
    //console.log(list)
    save(JSON.stringify(list,null,4))
}

function save(data) {
    fs.writeFileSync('m.json',data,'utf8',function (res) {
        console.log('写入文章')

    })

}

function getClass(_data) {
    if (/科幻/.test(_data.class)){ return 3 }
    if (/都市/.test(_data.class)){ return 1 }
    if (/仙侠/.test(_data.class)){ return 2 }
    if (/历史/.test(_data.class)){ return 4 }
    if (/玄幻/.test(_data.class)){ return 10 }
}