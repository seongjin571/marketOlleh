var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var NaverStrategy = require('passport-naver').Strategy;

var conn = mysql.createConnection(dbconfig);

/*  local login  */
// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/main',
//   failureRedirect: '/start',
//   failureFlash: true
// }));

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send(
        '<script type="text/javascript">alert("존재하지 않는 아이디입니다."); document.location.href="/start";</script>'
      );
    }
    req.login(user, function(err){
      if(err){
        return next(err);
      }
      return res.redirect('/main');
    });
  })(req, res, next);
});


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
  function (req, userid, userpwd, done) {
    var sql = 'select * from `user` where `user_id`=? and `password`=?;';
    conn.query(sql, [userid, userpwd], function (error, rows) {
      if (error) {
        console.log(error);
        return done(error, false);
      }
      else if (!rows.length) {
        console.log('no id or wrong pwd');
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
    callbackURL: '/oauth/kakao/callback'
  },
  function(accessToken, refreshToken, profile, done) {

    var selectSql = 'select * from `user` where `user_id`=?;';
    var insertSql = 'insert into `user`(`user_id`, `password`, `user_name`) values (?,?,?);';
    conn.query(selectSql, [profile.id], function (error, results) {
      if (error) { return done(error, false); }
      else if (!results.length) {
        conn.query(insertSql, [profile.id, profile.id, profile.username], function (err, rows) {
          if (err) { return done(err, false); }
          else {
            return done(null, profile);
          }
        });
      }
      else {
        return done(null, profile);
      }
    });
  }
));

router.get('/oauth/kakao/callback', passport.authenticate('kakao-login', {
  successRedirect: '/main',
  failureRedirect: '/start'
}));


/*  logout  */
router.get('/logout', function (req, res) {
  delete req.session.usestamp_market_name;
  req.logout();
  res.redirect('/start');
});


router.post('/loginmanager', function (req, res, next) {
  var id = req.body.manager_id;
  var password = req.body.password;

  var sql = "select * from manager where manager_id=?";
  conn.query(sql, [id], function (error, results, fields) {
    if (error) {
      console.log('id');

    } else {
      var user = results[0];
      if (!user) {
        console.log('manager_id fail');
        res.send({ result: 'error' });
      } else if (password == user.password) {
        req.session.authId = id;
        console.log(id);
        console.log('asdad');
        req.session.save(function () {
          res.send({ result: 'success' });
        });
      } else {
        res.send({ result: 'error' });
      }
    }
  });
});


router.get('/logoutmanager', function (req, res) {
  delete req.session.authId;
  res.redirect('/start');
});
module.exports = router;
