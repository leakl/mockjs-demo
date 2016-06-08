var http = require('http');
function requestWithTimeout(url,timeout,callback){
    var timeoutEventId,
        req=http.get(url,function(res){
            req.res =res;
            res.on('end',function(){
                clearTimeout(timeoutEventId);
                console.log('response end...');
            });

            res.on('close',function(){
                clearTimeout(timeoutEventId);
                console.log('response close...');
            });

            res.on('abort',function(){
                console.log('abort...');
            });

            callback(res);
        });

    req.on('timeout',function(e){
        if(req.res){
            req.res.destroy();
        }
        req.abort();

    });


    timeoutEventId=setTimeout(function(){
        req.emit('timeout',{message:'have been timeout...'});
    },timeout);

    return req;
}
module.exports = requestWithTimeout;