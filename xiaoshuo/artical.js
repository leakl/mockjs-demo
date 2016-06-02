var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var fileName = 0;
var json= ''

json = fs.readFileSync('chaopingtuoshi/menu.json','utf8',function (res) {

})
json = JSON.parse(json)

function getart(id) {
    var url = json[id].url;

    http.get(url, function(res) {
        var size = 0;
        var chunks = [];
        var bufferHelper = new BufferHelper();
        res.on('data', function(chunk){
            bufferHelper.concat(chunk);
        });

        res.on('end', function(){
            var result = iconv.decode(bufferHelper.toBuffer(),'utf8');
            resolveHtml(result)
        });
    })

    function resolveHtml(data){
        $ = cheerio.load(data);
        var listDom = $('#content').text();
        listDom=listDom.replace(/    /g,'\n\n    ');
       // save(listDom)
         console.log(listDom)
    }
    //
    // function save(data) {
    //     fs.writeFileSync(saveArtUrl,data,'utf8',function (res) {
    //         console.log(res)
    //     })
    // }
}

getart(717)