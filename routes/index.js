var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var conn = mysql.createConnection(dbconfig);



router.get('/start', function(req, res){
  res.render('start');
});

router.get('/coupon', function(req, res){
  //resullt1은 발급쿠폰 결과
  //result2는 발급받은 스탬프
  var find_coupon_manager = 'select * from `manager`';
  var find_stamp = 'select * from `stamp` where `user_id` =?';
  var user_id = req.user.id;
  var mycoupon = 'select * from `coupon_customer` where `user_id` = ?';
  var couponlist = 'select * from `coupon_manager`';
  conn.query(couponlist,function(err,cou_result,fields){
    if(err){
      console.log('시작부터에러');
    }else if(! cou_result.length){
      conn.query(mycoupon,[user_id],function(error,result1,fields){
        if(error){
          console.log('error1');
        }
        else if(! result1.length){
          console.log('발급받은쿠폰없음');
          conn.query(find_stamp,[user_id],function(error,result2,fields){
            if(error){
              console.log('error2');
            }
            else if(! result2.length){
              console.log('발급받은 스탬프 없음');
              res.render('coupon', {
                title : '발급받은쿠폰없고 스탬프 없고',
                result1 : undefined,
                result2 : undefined,
                cou_result : undefined
              })
            }else{
              console.log('발급받은 스탬프 있음1');
              console.log('cou_result');
              res.render('coupon', {
                title : '발급받은쿠폰없고 스탬프 있고',
                result1 : undefined,
                result2 : result2,
                cou_result : undefined
              })
            }
          })
        }
        else{
          console.log('발급받은쿠폰이있는경우');
          conn.query(find_stamp,[user_id],function(error,result2,fields){
            if(! result2.length){
              console.log('발급받은 스탬프 없음');
              res.render('coupon',{
                title : '쿠폰있고 스탬프 없고',
                result1 : result1,
                result2 : undefined,
                cou_result : undefined
              })
            }else{
              console.log('발급받은 스탬프 있음');
              res.render('coupon',{
                title : '쿠폰있고 스탬프 있고',
                result1 : result1,
                result2 : result2,
                cou_result : undefined
              })
            }
          })
        }
      })
    }else{
      conn.query(mycoupon,[user_id],function(error,result1,fields){
        if(error){
          console.log('error1');
        }
        else if(! result1.length){
          console.log('발급받은쿠폰없음');
          conn.query(find_stamp,[user_id],function(error,result2,fields){
            if(error){
              console.log('error2');
            }
            else if(! result2.length){
              console.log('발급받은 스탬프 없음');
              res.render('coupon', {
                title : '발급받은쿠폰없고 스탬프 없고',
                result1 : undefined,
                result2 : undefined,
                cou_result : cou_result
              })
            }else{
              console.log('발급받은 스탬프 있음');
              console.log(cou_result);
              res.render('coupon', {
                title : '발급받은쿠폰없고 스탬프 있고',
                result1 : undefined,
                result2 : result2,
                cou_result : cou_result
              })
            }
          })
        }
        else{
          console.log('발급받은쿠폰이있는경우');
          conn.query(find_stamp,[user_id],function(error,result2,fields){
            if(! result2.length){
              console.log('발급받은 스탬프 없음');
              res.render('coupon',{
                title : '쿠폰있고 스탬프 없고',
                result1 : result1,
                result2 : undefined,
                cou_result : cou_result
              })
            }else{
              console.log('발급받은 스탬프 있음');
              console.log('cou_result');
              res.render('coupon',{
                title : '쿠폰있고 스탬프 있고',
                result1 : result1,
                result2 : result2,
                cou_result : cou_result
              })
            }
          })
        }
      })
    }
  })
});

router.get('/couponManager', function(req, res, next) {
  var sql='select * from manager where `manager_id`=?;';
  var sql2 = 'select * from coupon_manager where `manager_id`=?';
    conn.query(sql,[req.session.authId],function(error,results,fields){
      if(error){
        console.log(error);
      }
      else{
        conn.query(sql2,[req.session.authId],function(error,results1,fields){
          if(error){
            console.log(error);
            console.log('information failed');
          }
          else if(! results1.length){
            console.log(req.session.authId);
            console.log('발급한 쿠폰이 없는 경우');
            res.render('couponManager',{
              title:'couponManager_no',
              results : results,
              results1 : undefined
            });
          }else{
            console.log(req.session.authId);
            console.log('발급한 쿠폰이 있는 경우');
            res.render('couponManager',{
              title:'couponManager_yes',
              results : results,
              results1 : results1
            });
          }
        });
      }
    });
});


router.post('/couponManager', function(req, res) {
  var market_name = req.body.market_name;
  var manager_id = req.body.manager_id;
  var sijang_name = req.body.sijang_name;
  var coupon_standard = req.body.coupon_standard;
  var coupon_count = req.body.coupon_count;
  var coupon_password = req.body.coupon_password;
  var coupon_reward = req.body.coupon_reward;
  var sql = 'insert into `coupon_manager`(`manager_id`,`market_name`,`sijang_name`,`coupon_standard`,`coupon_reward`,`coupon_password`,`coupon_count`) values (?,?,?,?,?,?,?);';
  conn.query(sql, [manager_id, market_name, sijang_name, coupon_standard, coupon_reward, coupon_password, coupon_count], function(error, result){
    if(error){
      console.log(error);
    }else {
        res.send({ result: 'success' });
    }
  });
});

router.get('/mystampManager', function(req, res){
  var manager_id = req.session.authId;
  var sql = 'select * from manager where manager_id = ?';
  conn.query(sql,[manager_id],function(error,result){
    if(error){
      console.log(error);
    }
    else{
      console.log('good');
      res.render('mystampManager', {
        result: result,
        admin_name: req.session.authId,
      });
    }
  })
});

router.get('/searching', function(req, res) {
  res.render('searching');
});

// 검색 부분 ajax 데이터 통신 위한 페이지 (렌더링 view X)
router.post('/searching/gooname', function(req, res){

  // goo tile click
  var gooname = req.body.gooname;

  // submit ~ ajax (searching)
  var filed = req.body.filed;
  var search_value = req.body.search_value;

  if(gooname){ // NewGoo ~ table에서 구 선택시 오는 부분
    var sql = "SELECT * FROM `market` WHERE `gooname` LIKE '%"+gooname+"%'";
    conn.query(sql, function(error, rows, fileds) {
      return res.send({ rows: rows });
    });// conn.query
  } else if(filed&&search_value){ // searching ~ 에서 접속 DB 부분
    /*
    // main.ejs ~ Searching ~ select 에서 뭘 선택했냐에 따라
    if (filed == "market_name") { // 상점 이름으로 검색 ~ manager table
      var sql = "SELECT * FROM `manager` WHERE `"+filed+"` LIKE '%"+search_value+"%'";
      conn.query(sql, function(error, rows, fileds) {
      return res.send({ rows: rows });
      }); // conn.query

    } else { // 시장 이름으로 검색 ~ market table
      console.log("시장 이름 으로 검색");
      console.log(filed);
      var sql = "SELECT * FROM `market` WHERE `"+filed+"` LIKE '%"+search_value+"%'";
      conn.query(sql, function(error, rows, fileds) {
      return res.send({ rows: rows });
      }); // conn.query

    } else { // 시장 이름으로 검색 ~ market table
    */
      // X --> 시장이름 뿐 아니라 상점이름으로 까지 같이 동작
      var sql_first = "SELECT * FROM `market` WHERE `"+filed+"` LIKE '%"+search_value+"%'";
      conn.query(sql_first, function(error, rows_first, fileds) {
        var sql_second = "SELECT * FROM `manager` WHERE `market_name` LIKE '%"+search_value+"%'";
        conn.query(sql_second, function(error, rows_second, fileds) {
          if (rows_second.length > 0) {
            var temp = rows_first.length;
            for( var i = 0; i < rows_second.length; i++){
              rows_first[temp + i] = rows_second[i];
            } // inner for
          } // inner if
          console.log(rows_first);
          return res.send({ rows: rows_first });
        }); // inner conn.query
      }); // conn.query
    /*
    } // inner else
    */
  }// else if

}); // post /searching/gooname



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
  var sql2 = 'select * from `manager` where market_name = ? and sijang_name = ?';
  console.log(user_id);
  conn.query(sql,[market_name,sijang_name,user_id], function(error, result){
    if(error){
      console.log(error);
    }else{
      if(result[0] == null){
        conn.query(sql2,[market_name,sijang_name],function(error,result1){
          console.log(market_name);
          console.log(sijang_name);
          // console.log(result);
          res.render('store_infor', {
            title: '스탬프 미존재',
            result : result,
            result1 : result1,
            user_id : user_id,
            sijang_name : result1[0].sijang_name,
            market_name : result1[0].market_name,
            stamp_standard : result1[0].stamp_standard,
            stamp_reward : result1[0].stamp_reward,
            stamp_password : result1[0].stamp_password
          });
        });
      }else{
        conn.query(sql2,[market_name,sijang_name],function(error,result1){
          console.log(market_name);
          console.log(sijang_name);
          // console.log(result);
          res.render('store_infor', {
            title: '스탬프 존재',
            result : result,
            result1 : result1,
            user_id : user_id,
            sijang_name : result1[0].sijang_name,
            market_name : result1[0].market_name,
            stamp_standard : result1[0].stamp_standard,
            stamp_reward : result1[0].stamp_reward,
            stamp_password : result1[0].stamp_password
          });
        });
      }
    }
  })
});


router.get('/myStamp', function(req, res) {
  // var sql = 'select * from `stamp` where `user_id`=?';
  // var sqlJoin = 'SELECT * FROM stamp INNER JOIN manager ON stamp.sijang_name=manager.sijang_name and stamp.market_name=manager.market_name WHERE user_id=?;';
  var sqlJoin = 'SELECT stamp.id, stamp.user_id, stamp.sijang_name, stamp.market_name, stamp.stamp_count, stamp.stamp_standard, stamp.stamp_password, stamp.stamp_reward, likeMarket.like_check ,manager.like_count, manager.market_introduce FROM stamp INNER JOIN manager ON stamp.sijang_name=manager.sijang_name and stamp.market_name=manager.market_name INNER JOIN likeMarket ON manager.sijang_name=likeMarket.sijang_name and manager.market_name=likeMarket.market_name and stamp.user_id=likeMarket.user_id WHERE stamp.user_id=?;';
  var sql2 = 'select * from `review` where `user_id`=?';
  conn.query(sqlJoin, [req.user.id],function(error, result){
    if(error) {
       console.log(error);
      }
    else {
      if(! result.length) {
        console.log("sql은 들어왔으나 stamp디비에 값이 없어서 sql2실행 x");
        res.render('myStamp', {
          user: req.user,
          myStamps: undefined,
        });
      }
      else {
        conn.query(sql2, [req.user.id],function(error2, results){
        if(error2) { console.log(error2); }
        else {
          console.log(result);
          if(! results.length) {
            console.log(req.session.market_name);
            console.log("stamp디비에는 값이 있으나 review값은 없는 경우");
            res.render('myStamp', {
              user: req.user,
              myStamps: result,
              review : undefined
            });
          }
          else {
            console.log("stamp,review값이 모두 있는 경우");
            res.render('myStamp', {
              user: req.user,
              myStamps: result,
              review : results
            });
          }
        }
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

router.post('/aboutstamp_count/:id',function(req,res,next){
  var stamp_count = req.body.stamp_count;
  // var user_id = req.body.user_id;
  // var market_name = req.body.market_name;
  var stamp_id = req.params.id;
  var sql = 'update `stamp` set `stamp_count`=? where `id`=?;';
  conn.query(sql,[stamp_count, stamp_id],function(error,result,fields){
    if(error){
      console.log('aboutstamp_count error');
    }else{
      var sql2 = 'select * from `stamp` where `id`=? ;';
      conn.query(sql2, [stamp_id], function(err, rows) {
        if(err) { console.log(err); }
        else {
          res.send({
            result : 'success',
            new_stamp_count: rows[0].stamp_count
          });
        }
      });
    }
  })
});

router.post('/reset_aboutstamp_count/:id',function(req,res,next){
  var stamp_count = req.body.stamp_count;
  // var user_id = req.body.user_id;
  // var market_name = req.body.market_name;
  var stamp_id = req.params.id;
  var sql = 'update `stamp` set `stamp_count`=? where `id`=?;';
  conn.query(sql,[stamp_count, stamp_id],function(error,result,fields){
    if(error){
      console.log('reset_aboutstamp_count error');
    }else{
      res.send({
        result : 'successs'
      });
    }
  })
});


router.post('/stamp_count_password/:id',function(req,res,next){
  // var user_id = req.body.user_id;
  // var market_name = req.body.market_name;
  var stamp_id = req.params.id;
  var sql = 'select * from `stamp` where `id`=?;';
  // var sql = 'select * from stamp where user_id =? and market_name = ?';
  conn.query(sql,[stamp_id],function(error,results,fields){
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

router.post('/make_stamp', function(req, res) {
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var user_id = req.body.user_id;
  var stamp_count = req.body.stamp_count;
  var stamp_standard = req.body.stamp_standard;
  var stamp_reward = req.body.stamp_reward;
  var stamp_password = req.body.stamp_password;
  var postsql = "select * from `stamp` where user_id = ? and market_name = ? and sijang_name = ?"
  var sql = 'insert into `stamp`(`user_id`,`market_name`,`stamp_count`,`stamp_standard`,`stamp_reward`,`stamp_password`,`sijang_name`) values (?,?,?,?,?,?,?);';
  var likeInsertSql = 'insert into `likeMarket` (`user_id`, `sijang_name`, `market_name`) values (?, ?, ?) ;';
  var likeSelectSql = 'select * from `likeMarket` where `user_id`=? and `sijang_name`=? and `market_name`=? ;';

  conn.query(postsql, [user_id,market_name,sijang_name], function(error, results){
    if(error) { console.log(error); }
    else if(results.length) {
      res.send({ result: 'already' });
    }
    else{
      conn.query(sql,[user_id,market_name,stamp_count,stamp_standard,stamp_reward,stamp_password,sijang_name],function(error,result,fields){
        if(error){
          console.log(error);
          console.log('error');
        }
        else{
          conn.query(likeSelectSql, [req.user.id, sijang_name, market_name], function(likeSelErr, likeSelRows) {
            if(likeSelErr) {
              console.log(likeSelErr);
              console.log('likeMarket 테이블 조회 실패');
            }
            else if(likeSelRows.length) {
              console.log('likeMarket 테이블 조회 성공');
              res.send({ result: 'success' });
            }
            else {
              console.log('likeMarket 테이블 조회 성공 but 결과 값 없음');
              conn.query(likeInsertSql, [req.user.id, sijang_name, market_name], function(likeInsertErr, likeInsertRows) {
                if(likeInsertErr) {
                  console.log(likeInsertErr);
                  console.log('likeMarket 테이블 삽입 실패');
                }
                else {
                  console.log('likeMarket 테이블 삽입 성공');
                  res.send({ result: 'success' });
                }
              });
              //
            }
          });
        }
      })
    }
  });
});


router.post('/review',function(req,res,next){
  var user_id = req.body.user_id;
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var date = req.body.date;
  var review = req.body.review;
  var sql = 'insert into `review`(`user_id`,`market_name`,`sijang_name`,`review`,`date`) values (?,?,?,?,?);';
  // var sql = 'select * from stamp where user_id =? and market_name = ?';
  console.log(user_id);
  conn.query(sql,[user_id,market_name,sijang_name,review,date],function(error,results,fields){
    if(error){
      console.log('er');
    }else{
      res.send({
        result : 'success'
      });
    }
  })
});


/* 좋아요 */
router.post('/like/:id', function(req, res) {
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var like_count = req.body.like_count;
  // var sql = 'update `manager` set `like_count`=? where `sijang_name`=? and `market_name`=? ;';
  var sql = 'UPDATE stamp INNER JOIN manager ON stamp.sijang_name=manager.sijang_name and stamp.market_name=manager.market_name INNER JOIN likeMarket ON manager.sijang_name=likeMarket.sijang_name and manager.market_name=likeMarket.market_name and stamp.user_id=likeMarket.user_id SET manager.like_count=?, likeMarket.like_check=? WHERE stamp.user_id=? and stamp.id=? ;';

  conn.query(sql, [like_count, 1, req.user.id, req.params.id], function(err, rows) {
    if(err) {
      console.log(err);
      console.log('sql failed');
    }
    else {
      console.log('update success');
      var selectSql = 'SELECT stamp.id, stamp.user_id, likeMarket.like_check ,manager.like_count FROM stamp INNER JOIN manager ON stamp.sijang_name=manager.sijang_name and stamp.market_name=manager.market_name INNER JOIN likeMarket ON manager.sijang_name=likeMarket.sijang_name and manager.market_name=likeMarket.market_name and stamp.user_id=likeMarket.user_id WHERE stamp.id=? and stamp.user_id=? ;';
      conn.query(selectSql, [req.params.id, req.user.id], function(error, result) {
        if(error) {
          console.log(error);
          console.log('select sql failed');
        }
        else {
          console.log(result);
          res.send({
            result: 'success',
            like: result[0].like_count
          });
        }
      });
    }
  });
});

router.post('/cancel_like/:id', function(req, res) {
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var like_count = req.body.like_count;
  // var sql = 'update `manager` set `like_count`=? where `sijang_name`=? and `market_name`=? ;';
  var sql = 'UPDATE stamp INNER JOIN manager ON stamp.sijang_name=manager.sijang_name and stamp.market_name=manager.market_name INNER JOIN likeMarket ON manager.sijang_name=likeMarket.sijang_name and manager.market_name=likeMarket.market_name and stamp.user_id=likeMarket.user_id SET manager.like_count=?, likeMarket.like_check=? WHERE stamp.user_id=? and stamp.id=? ;';

  conn.query(sql, [like_count, 0, req.user.id, req.params.id], function(err, rows) {
    if(err) {
      console.log(err);
      console.log('sql failed');
    }
    else {
      console.log('update success');
      var selectSql = 'SELECT stamp.id, stamp.user_id, likeMarket.like_check ,manager.like_count FROM stamp INNER JOIN manager ON stamp.sijang_name=manager.sijang_name and stamp.market_name=manager.market_name INNER JOIN likeMarket ON manager.sijang_name=likeMarket.sijang_name and manager.market_name=likeMarket.market_name and stamp.user_id=likeMarket.user_id WHERE stamp.id=? and stamp.user_id=? ;';
      conn.query(selectSql, [req.params.id, req.user.id], function(error, result) {
        if(error) {
          console.log(error);
          console.log('select sql failed');
        }
        else {
          console.log(result);
          res.send({
            result: 'success',
            like: result[0].like_count
          });
        }
      });
    }
  });
});


router.post('/delete_stamp/:id', function(req, res) {
  var sql = 'delete from `stamp` where id=?;';
  conn.query(sql, [req.params.id], function(err, rows) {
    if(err) {
      console.log('스탬프 삭제 실패');
      console.log(err);
    }
    else{
      res.send({ result: 'success' });
    }
  });
});

router.post('/manager_reform_stamp',function(req,res,next){//접수 버튼 클릭 시 ajax 통신하는 부분입니다.
  var manager_id = req.session.authId;
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var stamp_reward = req.body.stamp_reward;
  var stamp_password = req.body.stamp_password;
  var market_introduce = req.body.market_introduce;
  var market_promotion = req.body.market_promotion;

  var update_manager_sql = 'update manager set stamp_reward = ?, stamp_password = ?, market_introduce =?, market_promotion =? where manager_id = ?';
  var update_stamp_sql ='update stamp set stamp_reward = ?,stamp_password = ? where sijang_name = ? and market_name =?';
  conn.query(update_manager_sql,[stamp_reward, stamp_password, market_introduce, market_promotion,manager_id],function(error,result,fields){
    if(error){
      console.log(error);
      console.log('no1');
    }
    else{
      conn.query(update_stamp_sql,[stamp_reward, stamp_password, sijang_name,market_name],function(error,result2,fields){
        if(error){
          console.log(error);
          console.log('no2');
        }
        else{
          console.log(result);
          res.send({
            result : result,
            result2 : result2,
            success : 'success'
          });
        }
      });
    }
  });
});

module.exports = router;
