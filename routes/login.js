var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var NaverStrategy = require('passport-naver').Strategy;

var conn = mysql.createConnection(dbconfig);

router.get('/login', function(req, res) {
  res.render('loginUser');
});

/*  local login  */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use('local', new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'userpwd',
    passReqToCallback: true
  },
  function(req, userid, userpwd, done){
    var sql = 'select * from `user` where `user_id`=? and `password`=?;';
    conn.query(sql, [userid, userpwd], function(error, rows){
      if(error) {
        console.log(error);
        return done(error, false);
      }
      else if(! rows.length){
        return done(error, false);
      }
      else {
        var user = {
          id: rows[0].user_id,
          username: rows[0].user_name
        }
        return done(null, user);
      }
    });
  })
);


/*  kakao login  */
router.get('/login/kakao', passport.authenticate('kakao-login'));

passport.use('kakao-login', new KakaoStrategy({
    clientID: 'c9a735fae8a320ab9e04755d40497123',
    clientSecret: 'mnjlSVADKdIwpwucXg5uFBWGe6Jp8dnL',
    callbackURL: 'http://13.209.89.231:3000/oauth/kakao/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    var selectSql = 'select * from `user` where `user_id`=?;';
    var insertSql = 'insert into `user`(`user_id`, `password`, `user_name`, `user_phone`) values (?,?,?,?);';
    conn.query(selectSql, [profile.id], function(error, results) {
      if(error) { return done(error, false); }
      else if(! results.length) {
        conn.query(insertSql, [profile.id, profile.id, profile.username, 1], function(err, rows) {
          if(err) { return done(err, false); }
          else {
            return done(null, profile);
          }
        });
      }
      else{
        return done(null, profile);
      }
    });
  }
));

router.get('/oauth/kakao/callback', passport.authenticate('kakao-login', {
  successRedirect: '/',
  failureRedirect: '/login'
}));


/*  naver login  */
router.get('/login/naver', passport.authenticate('naver-login'));

passport.use('naver-login', new NaverStrategy({
    clientID: 'IQjUiLAFjfZQGiW55NnF',
    clientSecret: 'fxNo5EE8xE',
    callbackURL: 'http://13.209.89.231:3000/oauth/naver/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

router.get('/oauth/naver/callback', passport.authenticate('naver-login', {
  successRedirect: '/',
  failureRedirect: '/login'
}));


module.exports = router;
