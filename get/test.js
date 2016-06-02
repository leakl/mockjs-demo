var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var url = 'http://www.qidianshuju.com/rank/101/0.html'
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
       // console.log(data.toString())
    });

}).on('error', function(e) {
    console.log("Got error: " + e.message);
});

var list =[]

function resolveHtml(data){
    $ = cheerio.load(data);
    var listDom = $('#ranktable tr');

   for(var i =1;i<listDom.length;i++){
       var _data ={}
       // console.log(list[i].children)
       _data.id = listDom[i].children[0].children[0].data;
       _data.title = $(listDom[i].children[1]).text()
       _data.url = $(listDom[i].children[1]).children('a').attr('href')
       _data.type = $(listDom[i].children[2]).text()
       _data.author = $(listDom[i].children[3]).text()
       _data.size = $(listDom[i].children[5]).text()
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