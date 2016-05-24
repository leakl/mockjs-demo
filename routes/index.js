var express = require('express');
var router = express.Router();
var Mock = require('mockjs');
var Random = Mock.Random;

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = create();
  data.status = '1';
  data.info = '成功';
  res.jsonp(data);
});

/* GET article page. */
router.get('/article', function(req, res, next) {
  var data = createArticle();
  data.status = '1';
  data.info = '成功';
  res.jsonp(data);
});



//生成数据
function createArticle() {
  var data = Mock.mock({

      title: function () {
        return Random.ctitle(5,20)
      },
      author: function () {
        return Random.ctitle(2,6)
      },
      content: function () {
        return Random.cparagraph(20,60)
      },
      time: function () {
        return Random.now('yyyy-MM-dd HH:mm:ss')
      }


  })
  return data
}

//生成数据
function create() {
  var data = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|10-35': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1,
      title: function () {
        return Random.ctitle(5,20)
      },
      author: function () {
        return Random.ctitle(2,6)
      },
      size: function () {
        return Random.natural(100,9999)
      },
      time: function () {
        return Random.now('yyyy-MM-dd HH:mm:ss')
      },
      img:function () {
        return Random.image('50x70', '#f5f5f5')
      }
    }]
  })
  return data
}

module.exports = router;
