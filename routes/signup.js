var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');

var conn = mysql.createConnection(dbconfig);

router.get('/', function(req, res) {
  res.render('signupUser');
});

router.get('/signup_manager', function(req, res) {
  res.render('signupManager');
});

router.post('/', function(req, res) {
  var userId = req.body.userid;
  var userName = req.body.username;
  var password = req.body.userpwd;
  var selectSql = 'select * from `user` where `user_id`=?';
  var insertSql = 'insert into `user`(`user_id`, `password`, `user_name`) values (?,?,?);';

  conn.query(selectSql, [userId], function(error, results){
    if(error) { console.log(error); }
    else if(results.length) {
      res.send({ result: 'already' });
    }
    else{
      conn.query(insertSql, [userId, password, userName], function(err, rows){
        if(err){ console.log(err); }
        else{
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
  var selectSql = 'select * from `manager` where `manager_id`=?';
  var insertSql = 'insert into `manager`(`user_id`, `password`, `user_name`, `user_phone`) values (?,?,?,?);';

  conn.query(selectSql, [userId], function(error, results){
    if(error) { console.log(error); }
    else if(results.length) {
      res.send({ result: 'already' });
    }
    else{
      conn.query(insertSql, [userId, password, userName, userPhone], function(err, rows){
        if(err){ console.log(err); }
        else{
          res.send({ result: 'success' });
        }
      });
    }
  });
});
module.exports = router;
