var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var conn = mysql.createConnection(dbconfig);



router.get('/start', function(req, res){
  res.render('start');
});


router.get('/main', function(req, res){
  var stampSql = 'select * from `stamp` where `user_id`=?;';
  conn.query(stampSql, [req.user.id], function(error, results) {
    if(error) { console.log(error); }
    else {
      if(! results) {
        res.render('main', {
          user: req.user,
          myStamps: '발급받은 쿠폰이 없습니다.',
        });
      }
      else {
        res.render('main', {
          user: req.user,
          myStamps: results,
        });
      }
    }
  });
});


router.get('/mainManager', function(req, res){
  res.render('mainManager');
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

//상점 리스트 뜨기
router.get('/manager_list', function(req, res, next) {
  var sql='select * from manager;';//지원자 정보를 불러오는 쿼리문 저장
    conn.query(sql,function(error,results,fields){
      if(error){//데이터베이스에서 불러올 때 오류 메세지 띄워줌
        console.log(error);
        console.log('information failed');
      }
      else{//화면 렌더링 할 때 보내는 값, 사이트 제목, 지원자 정보
        res.render('manager_list',{
          title:'manager_list', // 사이트 제목
          results : results // 지원자 정보
        });//render
      }
    });//query
  //res.render('applyadmin',{title:'apply admin page'});
});

module.exports = router;
