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
      if(! results.length) {
        console.log(results);
        res.render('main', {
          user: req.user,
          myStamps: undefined,
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

router.get('/myStamp', function(req, res){
  var stampSql = 'select * from `stamp` where `user_id`=?;';
  conn.query(stampSql, [req.user.id], function(error, results) {
    if(error) { console.log(error); }
    else {
      if(! results.length) {
        console.log(results);
        res.render('myStamp', {
          user: req.user,
          myStamps: undefined,
        });
      }
      else {
        res.render('myStamp', {
          user: req.user,
          myStamps: results,
        });
      }
    }
  });
});


router.get('/mainManager', function(req, res){
  res.render('mainManager', {
    admin_name: req.session.authId,
  });
});

router.get('/mystore', function(req, res){
  res.render('mystore');
});


router.get('/store_infor', function(req, res) {
  var user_id = req.user.id;
  var market_name = req.session.usestamp_market_name;
  var sijang_name = req.session.usestamp_sijang_name;
  var sql = 'select * from `stamp` where market_name = ? and sijang_name = ? and user_id = ?';
  console.log(user_id);
  conn.query(sql,[market_name,sijang_name,user_id], function(error, result){
    if(error){
      console.log(error);
    }else{
      if(result[0] == null){
        console.log(market_name);
        console.log(sijang_name);
        // console.log(result);
        res.render('store_infor', {
          title: '스탬프 미존재',
          result : result
        });
      }else{
        console.log(market_name);
        console.log(sijang_name);
        // console.log(result);
        res.render('store_infor', {
          title: '스탬프 존재',
          result : result
        });
      }
    }
  })
});


router.get('/myStamp', function(req, res) {
  var sql = 'select * from `stamp` where `user_id`=?';
  conn.query(sql, [req.user.id],function(error, result){
    if(error) { console.log(error); }
    else {
      if(! result.length) {
        console.log(result);
        res.render('myStamp', {
          user: req.user,
          myStamps: undefined,
        });
      }
      else {
        res.render('myStamp', {
          user: req.user,
          myStamps: result,
        });
      }
    }
  });
});

router.post('/managerlistnextpage', function(req, res) {
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var sql = 'select * from manager where market_name = ? and sijang_name=?';
  conn.query(sql,[market_name,sijang_name],function(error,result,fields){
    if(error){
      console.log('error');
    }else{
      console.log(market_name);
      req.session.usestamp_market_name = market_name;
      req.session.usestamp_sijang_name = sijang_name;
      req.session.save(function() {
        res.send({result:'success'});
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
