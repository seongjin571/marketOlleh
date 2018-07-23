var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var conn = mysql.createConnection(dbconfig);

router.get('/', function(req, res) {
  res.render('signupUser');
});

router.post('/', function(req, res) {
  var userId = req.body.userid;
  var userName = req.body.username;
  var userPhone = req.body.userphone;
  var password = req.body.userpwd;
  var selectSql = 'select * from `user` where `user_id`=?';
  var insertSql = 'insert into `user`(`user_id`, `password`, `user_name`, `user_phone`) values (?,?,?,?);';

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
