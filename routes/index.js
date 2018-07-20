var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var conn = mysql.createConnection(dbconfig);
/* GET home page. */

router.get('/', function(req, res) {
  res.render('a', { title: 'Express' });
});

module.exports = router;
