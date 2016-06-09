/**
 * Created by Administrator on 2016/6/9.
 */
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var requestWithTimeout = require('../../get/http_timeout.js');
var Menu = require('./getMenu.js');
var timeout =false,menuList=[];
var num = 0;
var index = 0;
function getMenuList(num) {
    Menu.getMenu(num,function (res) {
        if(res){
            menuList = res;
            num = num + menuList.length;
        }
        getOrigin()
    })
}
getMenuList(num)


//取远程数据
function getOrigin() {
    console.log('===',index,'===',menuList[index].id,'===',menuList[index].title_id,'===',menuList[index].cai_content_url,'=====')
    var url = menuList[index].cai_content_url;
    var resGetNum =0;
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

            console.log('超时,准备一下list');
            resGetNum = 0;

        } else {
            resGetNum++;
            console.log('连接超时,重新获取');
        }
        var i = 15, _t;
        _t = setInterval(function () {
            console.log('等' + i + '秒重试');
            i--;
            if (i <= 0) {
                clearInterval(_t);
                timeout =false
                getOrigin()
            }
        }, 1000)
    })
}


//解释HTML
function resolveHtml(result) {
    var $ = cheerio.load(result);
    var content = $('#content').text() || '没有内容';

    saveContent(content)
}

//
function saveContent(content) {
    if(content !='没有内容'){
        var contentS = content.match(/\n    [\s\S]*\n手机阅读本章/m);
    }else{
        var contentS = ['没有内容']
        console.log('没有内容，跳过')
    }


    if(contentS.length) {
        content = contentS[0];
        content = content.replace(/"/gm, '“');
        content = content.replace(/手机阅读本章/m, '');
        content = content.replace(/\n/gm, '\n<br/>');
        // console.log(content)
        // fs.writeFileSync('content.html',content,'utf8')

    }else{
        console.log('匹配不到内容，跳过')
        next()
    }
    var data ={}
    data.title_id = menuList[index].title_id;
    data.menu_id = menuList[index].id;
    data.content = content;
    data.url = menuList[index].cai_content_url;
    Menu.saveContent(data,function (res) {
        if(res.insertId){
            Menu.setMenuStatus(data.menu_id,function (res) {
                if(res.affectedRows>0){
                    console.log('插入新数据成功,改变状态id:'+data.menu_id)
                    next()
                }
            })

        }else {
            console.log(res)
        }
    })
}


//
function next() {

    if(index < menuList.length-1){
        console.log('================================等1秒下一条====================================\n')
        index++;
        setTimeout(function () {

            getOrigin()
        },0)
    }else{
        console.log('\n================加入新数据===========\n')
        index = 0;
        getMenuList(num)
    }

}
