var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var conn = mysql.createConnection(dbconfig);



router.get('/start', function(req, res){
  res.render('start');
});


router.get('/main', function(req, res){
  res.render('main');
});

router.get('/store_infor', function(req, res) {
  var sql = 'select * from `stamp`';
  conn.query(sql, function(error, result){
    if(error){
      console.log(error);
    }else{
      res.render('store_infor', {
        title: 'coupon',
        result : result
      });
    }
  })
});


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


router.post('/stamp_count_password',function(req,res,next){
  var user_id = req.body.user_id;
  var market_name = req.body.market_name;
  var sql = 'select * from stamp where user_id =? and market_name = ?';
  conn.query(sql,[user_id,market_name],function(error,results,fields){
    if(error){
      console.log('stamp_count_password error');
    }else{
      res.send({
        password : results[0].stamp_password,
        result : 'success'
      });
    }
  })
});

module.exports = router;
