var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

function getmenu() {
    var url = 'http://www.bookabc.net/5200/114917/'
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

    var list =[];
    function resolveHtml(data){
        $ = cheerio.load(data);
        var listDom = $('#bgdiv tbody .dccss');
        for(var i =1;i<listDom.length;i++){
            var d =$(listDom[i]).children('a');
            var _data ={}
            _data.id = i;
            _data.title = d.text()
            _data.url =d.attr('href');
            list.push(_data)
        }
        console.log(list)
        save(JSON.stringify(list,null,4))
    }

    function save(data) {
        fs.writeFile('./data.json',data,'utf8',function (res) {
            console.log(res)
        })
    }
}