var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var fileName = 0;
var saveArtUrl = 'chaopingtuoshi/art/'+fileName+'.txt';
var saveUrl = 'chaopingtuoshi/menu.json';
var baseUrl = 'http://www.fs23.com'
var list =[];
function getmenu() {
    var url = baseUrl+'/dudu/29/29272/'
    http.get(url, function(res) {
        var size = 0;
        var chunks = [];

        res.on('data', function(chunk){
            size += chunk.length;
            chunks.push(chunk);
        });

        res.on('end', function(){
            var data = Buffer.concat(chunks, size);
            resolveHtml(data.toString())
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });


    function resolveHtml(data){
        $ = cheerio.load(data);
        var listDom = $('#list dd a');
        for(var i =1;i<listDom.length;i++){
            var d =$(listDom[i]);
            var _data ={}
            _data.id = i;
            _data.title = d.text()
            _data.url =baseUrl + d.attr('href');
            list.push(_data)
        }
        console.log(list)
        save(JSON.stringify(list,null,4))
    }

    function save(data) {
        fs.writeFileSync(saveUrl,data,'utf8',function (res) {
            console.log('写入文章')

        })
     
    }
}
getmenu();



