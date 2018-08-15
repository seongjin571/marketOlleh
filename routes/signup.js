var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');

var conn = mysql.createConnection(dbconfig);


router.post('/signupuser', function(req, res) {
  var userId = req.body.userid;
  var userName = req.body.username;
  var password = req.body.userpwd;
  var selectSql = 'select * from `user` where `user_id`=?';
  var insertSql = 'insert into `user`(`user_id`, `password`, `user_name`) values (?,?,?);';

  conn.query(selectSql, [userId], function(error, results){
    if(error) { console.log(error); }
    else if(results.length) {
      console.log('er 1');
      res.send({ result: 'already' });
    }
    else{
      conn.query(insertSql, [userId, password, userName], function(err, rows){
        if(err){ console.log(err); }
        else{
          console.log('er 1');
          res.send({ result: 'success' });
        }
      });
    }
  });
});


router.post('/signupmanager', function(req, res) {
  var manager_id = req.body.manager_id;
  var password = req.body.password;
  var market_name = req.body.market_name;
  var market_location = req.body.market_location;
  var manager_phone = req.body.manager_phone;
  var manager_name = req.body.manager_name;
  var stamp_standard = req.body.stamp_standard;
  var stamp_reward = req.body.stamp_reward;
  var stamp_password = req.body.stamp_password;
  var market_promotion = req.body.market_promotion;
  var market_introduce = req.body.market_introduce;
  var sijang_name = req.body.sijang_name;
  var selectSql = 'select * from `manager` where `manager_id`=?';
  var insertSql = 'insert into `manager`(`manager_id`, `password`, `market_name`,`market_location`,`manager_phone`,`manager_name`,`stamp_standard`,`stamp_reward`,`stamp_password`,`market_promotion`,`market_introduce`,`sijang_name`) values (?,?,?,?,?,?,?,?,?,?,?,?);';

  conn.query(selectSql, [manager_id], function(error, results){
    if(error) { console.log(error); }
    else if(results.length) {
      res.send({ result: 'already' });
    }
    else{
      conn.query(insertSql, [manager_id, password, market_name,market_location,manager_phone,manager_name,stamp_standard,stamp_reward,stamp_password,market_promotion,market_introduce,sijang_name], function(err, rows){
        if(err){ console.log(err); }
        else{
          res.send({ result: 'success' });
        }
      });
    }
  });
});

module.exports = router;
