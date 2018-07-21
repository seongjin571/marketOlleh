var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var conn = mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
// router.get('/coupon', function(req, res) {
//   res.render('coupon', { title: 'Express' });
// });

router.get('/myStamp', function(req, res) {
  var sql = 'select * from `stamp`';
  conn.query(sql, function(error, result){
    if(error){
      console.log(error);
    }else{
      res.render('myStamp', {
        title: 'coupon',
        result : result
      });
    }
  })
});

router.post('/aboutstamp_count',function(req,res,next){
  var stamp_count = req.body.stamp_count;
  var user_id = req.body.user_id;
  var market_name = req.body.market_name;
  var sql = 'update stamp set stamp_count =? where user_id = ? and market_name =?';
  conn.query(sql,[stamp_count, user_id,market_name],function(error,result,fields){
    if(error){
      console.log('aboutstamp_count error');
    }else{
      res.send({
        result : 'success'
      });
    }
  })
});

router.post('/reset_aboutstamp_count',function(req,res,next){
  var stamp_count = req.body.stamp_count;
  var user_id = req.body.user_id;
  var market_name = req.body.market_name;
  var sql = 'update stamp set stamp_count =? where user_id = ? and market_name =?';
  conn.query(sql,[stamp_count, user_id,market_name],function(error,result,fields){
    if(error){
      console.log('reset_aboutstamp_count error');
    }else{
      res.send({
        result : 'successs'
      });
    }
  })
});


module.exports = router;
