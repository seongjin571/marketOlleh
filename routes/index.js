var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('../database.js');
var conn = mysql.createConnection(dbconfig);
var app= express();

router.get('/photo', function(req, res){
  res.render('photo');
});


router.get('/share/:sijang_name/:market_name', function(req, res){
  var marketSql = 'select * from `manager` where `sijang_name`=? and `market_name`=? ;';
  var reviewSql = 'select * from `review` where `sijang_name`=? and `market_name`=? ;';
  var avgSql = 'SELECT IFNULL(round(avg(rate),0), 0) as avgRate FROM `review` WHERE `sijang_name`=? and `market_name`=? GROUP BY `sijang_name`, `market_name` ;';
  conn.query(marketSql, [req.params.sijang_name, req.params.market_name], function(marketErr, marketRows) {
    if(marketErr) {
      console.log(marketErr);
      console.log('가게 정보 에러');
    }
    else {
      conn.query(reviewSql, [req.params.sijang_name, req.params.market_name], function(reviewErr, reviewRows) {
        if(reviewErr) {
          console.log(reviewErr);
          console.log('리뷰 정보 에러');
        }
        else {
          conn.query(avgSql, [req.params.sijang_name, req.params.market_name], function(avgErr, avgRows) {
            if(avgErr) {
              console.log(avgErr);
              console.log('평균 에러');
            }
            else {
              var avgRate = avgRows[0];
              if(! avgRate) { avgRate = 0; }
              res.render('share', {
                market: marketRows[0],
                reviews: reviewRows,
                avg: avgRate
              }); // render
            } // avg else
          }); // avg sql
        } // review else
      }); // review sql
    } // market else
  }); // market sql
});

router.get('/eud_camera', function(req, res){
  res.render('eud_camera');
});

router.get('/start', function(req, res){
  if(req.session.authId) {
    res.redirect('/mainManager');
  }
  else if(req.user) {
    res.redirect('main');
  }
  else {
    res.render('start');
  }
});
router.get('/location', function(req, res){
  res.render('location');
});



router.get('/findid', function(req, res){
  res.render('findid');
});

router.get('/findidmanager', function(req, res){
  res.render('findidmanager');
});
router.get('/findpassword_user', function(req, res){
  res.render('findpassword_user');
});
router.get('/findpassword_manager', function(req, res){
  res.render('findpassword_manager');
});

// GeoLocation Test page ( hw edit )
router.get('/geolo', function(req, res){
  res.render('cordova_gelocationTest');
});
router.get('/backb', function(req, res){
  //res.render('cordova_backbuttonTest');
  //res.render('eud_camera');
  res.render('photo');
});

router.get('/coupon', function(req, res){

  // 유저 아이디 세션, 변수값 저장
  var user_id = req.user.id;
  // SQL
  // var find_coupon_customer = 'select * from `coupon_customer` where `user_id` = ?';
  var find_stamp = 'select * from `stamp` where `user_id` =?';
  var mycoupon = 'select * from `coupon_customer` where `user_id`=?';
  var couponlist = 'select * from `coupon_manager`';
  var coupon_img = 'select * from market';
  //resullt1은 발급쿠폰 결과, result2는 발급받은 스탬프

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
              conn.query(coupon_img,function(errrr,img_result,fields){
                console.log('발급받은 스탬프 없음');
                console.log(img_result[0]);
                res.render('coupon', {
                  title : '발급받은쿠폰없고 스탬프 없고',
                  result1 : undefined,
                  result2 : undefined,
                  cou_result : undefined,
                  user_id : user_id,
                  img_result : img_result
                })
              })
            }else{
              console.log('발급받은 스탬프 있음1');
              console.log('cou_result');
              conn.query(coupon_img,function(errrr,img_result,fields){
                console.log(img_result[0]);
                res.render('coupon', {
                  title : '발급받은쿠폰없고 스탬프 있고',
                  result1 : undefined,
                  result2 : result2,
                  cou_result : undefined,
                  user_id : user_id,
                  img_result : img_result
                })
              })
            }
          })
        }
        else{
          console.log('발급받은쿠폰이있는경우');
          conn.query(find_stamp,[user_id],function(error,result2,fields){
            if(! result2.length){
              conn.query(coupon_img,function(errrr,img_result,fields){
                console.log('발급받은 스탬프 없음');
                console.log(img_result[0]);
                res.render('coupon',{
                  title : '쿠폰있고 스탬프 없고',
                  result1 : result1,
                  result2 : undefined,
                  cou_result : undefined,
                  user_id : user_id,
                  img_result : img_result
                })
              })
            }else{
              console.log('발급받은 스탬프 있음');
              conn.query(coupon_img,function(errrr,img_result,fields){
                console.log(img_result[0]);
                res.render('coupon',{
                  title : '쿠폰있고 스탬프 있고',
                  result1 : result1,
                  result2 : result2,
                  cou_result : undefined,
                  user_id : user_id,
                  img_result : img_result
                })
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
              conn.query(coupon_img,function(errrr,img_result,fields){
                console.log('발급받은 스탬프 없음');
                console.log(img_result[0]);
                res.render('coupon', {
                  title : '발급받은쿠폰없고 스탬프 없고',
                  result1 : undefined,
                  result2 : undefined,
                  cou_result : cou_result,
                  user_id : user_id,
                  img_result : img_result
                })
              })
            }else{
              //이부분
              console.log('발급받은 스탬프 있음');
              conn.query(coupon_img,function(errrr,img_result,fields){
                console.log(img_result[0]);
                res.render('coupon', {
                  title : '발급받은쿠폰없고 스탬프 있고',
                  result1 : undefined,
                  result2 : result2,
                  cou_result : cou_result,
                  user_id : user_id,
                  img_result : img_result
                })
              })
            }
          })
        }
        else{
          //이부분
          console.log('발급받은쿠폰이있는경우');
          conn.query(find_stamp,[user_id],function(error,result2,fields){
            if(! result2.length){
              console.log('발급받은 스탬프 없음');
              conn.query(coupon_img,function(errrr,img_result,fields){
                console.log(img_result[0]);
                res.render('coupon',{
                  title : '쿠폰있고 스탬프 없고',
                  result1 : result1,
                  result2 : undefined,
                  cou_result : cou_result,
                  user_id : user_id,
                  img_result : img_result
                })
              })
            }else{
              //이부분
              console.log('발급받은 스탬프 있음');
              console.log('cou_result');
              conn.query(coupon_img,function(errrr,img_result,fields){
                console.log(img_result[0].imgurl);
                res.render('coupon',{
                  title : '쿠폰있고 스탬프 있고',
                  result1 : result1,
                  result2 : result2,
                  cou_result : cou_result,
                  user_id : user_id,
                  img_result : img_result
                })
              })
            }
          })
        }
      })
    }
  })
});

/* 쿠폰 비밀번호 비교 */
router.post('/coupon_password/:id', function(req, res) {
  var sql = 'select `coupon_password` from `coupon_customer` where `id`=? ;';
  conn.query(sql, [req.params.id], function(err, rows) {
    if(err) {
      console.log(err);
      console.log('쿠폰 비밀번호 쿼리문 에러');
    }
    else {
      res.send({
        result: 'success',
        password: rows[0].coupon_password
      });
    }
  });
});


//아이디찾기
router.post('/findid', function(req, res) {
  var password = req.body.password;
  var email = req.body.email;
  var sql = 'select * from `user` where `user_name`=? and `email`=?;';
  conn.query(sql, [password, email], function(err, results) {
    if(err) {
      console.log(err);
      console.log('아이디찾기 에러');
    }
    else if(results.length){
      res.send({
        result : 'success',
        results: results
      });
    }else{
      res.send({
        result : 'fail',
        results : undefined
      });
    }
  });
});


//비밀번호 찾기
router.post('/findpw', function(req, res) {
  var id = req.body.id;
  var email = req.body.email;
  var sql = 'select * from `user` where `user_id`=? and `email`=?;';
  conn.query(sql, [id, email], function(err, results) {
    if(err) {
      console.log(err);
      console.log('비번 에러');
    }
    else if(results.length){
      res.send({
        result : 'success',
        results: results
      });
    }else{
      res.send({
        result : 'fail',
        results : undefined
      });
    }
  });
});

//상인아이디찾기
router.post('/findidmanager', function(req, res) {
  var password = req.body.password;
  var sijang_name = req.body.sijang_name;
  var market_name = req.body.market_name;
  var sql = 'select * from `manager` where `manager_name`=? and `sijang_name`=? and `market_name`=?;';
  conn.query(sql, [password, sijang_name, market_name], function(err, results) {
    if(err) {
      console.log(err);
      console.log('아이디찾기 에러');
    }
    else if(results.length){
      res.send({
        result : 'success',
        results: results
      });
    }else{
      res.send({
        result : 'fail',
        results : undefined
      });
    }
  });
});


//상인비번찾기
router.post('/findpwmanager', function(req, res) {
  var password = req.body.password;
  var sijang_name = req.body.sijang_name;
  var market_name = req.body.market_name;
  var sql = 'select * from `manager` where `manager_id`=? and `sijang_name`=? and `market_name`=?;';
  conn.query(sql, [password, sijang_name, market_name], function(err, results) {
    if(err) {
      console.log(err);
      console.log('비번찾기 에러');
    }
    else if(results.length){
      res.send({
        result : 'success',
        results: results
      });
    }else{
      res.send({
        result : 'fail',
        results : undefined
      });
    }
  });
});

/* coupon_customer 테이블에서 데이터 삭제 */
router.post('/del_coupon_customer/:id', function(req, res) {
  var sql = 'delete from `coupon_customer` where `id`=? ;';
  conn.query(sql, [req.params.id], function(err, rows) {
    if(err) {
      console.log(err);
      console.log('사용자가 발급 받은 쿠폰 삭제 실패');
    }
    else {
      res.send({ result: 'success' });
    }
  });
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
  var judge_coupon = 'select * from coupon_manager where `sijang_name`=? and `market_name`=?;';
  var sql = 'insert into `coupon_manager`(`manager_id`,`market_name`,`sijang_name`,`coupon_standard`,`coupon_reward`,`coupon_password`,`coupon_count`) values (?,?,?,?,?,?,?);';
  conn.query(judge_coupon,[sijang_name,market_name],function(err,results){
    if(err){
      console.log('judge_coupon error');
    }else if(results.length){
      res.send({ result: 'fail' });
    }else{
      conn.query(sql, [manager_id, market_name, sijang_name, coupon_standard, coupon_reward, coupon_password, coupon_count], function(error, result){
        if(error){
          console.log(error);
        }else {
            res.send({ result: 'success' });
        }
      });
    }
  })
});

router.get('/mystampManager', function(req, res){
  var manager_id = req.session.authId;
  var sql = 'select * from manager where manager_id = ?';
  var count_stamp = 'select count(*) as cnt2 from stamp where `market_name`=? and `sijang_name`=?;';
  conn.query(sql,[manager_id],function(error,result){
    if(error){
      console.log(error);
    }
    else{
      conn.query(count_stamp,[result[0].market_name,result[0].sijang_name],function(errr,results3,fields){
        if(errr){
          console.log('mainmanager errr');
        }else{
          console.log('good');
          res.render('mystampManager', {
              result: result,
              admin_name: req.session.authId,
              results3 : results3[0],
            });
          }
        })
    }
  })
});

router.get('/searching', function(req, res) {
  res.render('searching');
});

// 근처 시장 찾기
router.post('/searching/near', function(req, res) {

  // body...
  var sql = "SELECT * FROM `market`";
  conn.query(sql, function(error, rows, fileds) {
    return res.send({ rows: rows });
  });// conn.query

});
// 근처 상인(가맹점) 찾기
router.post('/searching/nearManager', function(req, res) {

  // body...
  var sql = "SELECT * FROM `manager`";
  conn.query(sql, function(error, rows, fileds) {
    return res.send({ rows: rows });
  });// conn.query

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
          //console.log(rows_first);
          return res.send({ rows: rows_first });
        }); // inner conn.query
      }); // conn.query
  } // else ~ if

}); // post /searching/gooname


// 검색후 리스트 클릭 ~ 인기 상점 뿌려주기 위한 라우팅
router.post('/searching/marketList', function(req, res){

  // 시장 이름
  var name = req.body.name;
  // 상점 이름
  var market_name = req.body.market_name;

  // 로그인한 상점 == 클릭한 상점 --> mystore
    if(!market_name){ // 해당하는 같은 시장, 상점 모두 가져오기
      var sql = "SELECT * FROM `manager` WHERE `sijang_name` LIKE '"+name+"' ORDER BY `like_count` DESC";
      conn.query(sql, function(error, rows, fileds) {
        return res.send({ rows: rows });
      });// conn.query
    } else if(market_name) { // 해당하는 시장은 유일
      var sql = "SELECT * FROM `manager` WHERE `sijang_name` LIKE '"+name+"' AND `market_name` LIKE '"+market_name+"'";
      conn.query(sql, function(error, rows, fileds) {
        return res.send({ rows: rows });
      });
    } // if ~ else

}); // post /searching/marketList


router.get('/main', function(req, res){
  var stampSql = 'select * from `stamp` where `user_id`=?;';
  var marketSql = 'SELECT * FROM `manager` ORDER BY like_count DESC ;';

  if(! req.user) {
    res.redirect('/start');
  }
  else {
    console.log('user session',req.user);

    conn.query(stampSql, [req.user.id], function(error, results) {
      if(error) { console.log(error); }
      else {
        conn.query(marketSql, function(marketErr, marketRows) {
          if(marketErr) {
            // console.log(req.user);
            console.log(marketErr);
            console.log('marketSql err');
          }
          else {
            //
            console.log(marketRows);
            if(! results.length) {
              console.log(results);
              res.render('main', {
                user: req.user,
                myStamps: undefined,
                market: marketRows
              });
            }
            else {
              res.render('main', {
                user: req.user,
                myStamps: results,
                market: marketRows
              });
            }
            //
          }
        });
      }
    });

  }
});

router.get('/mainManager', function(req, res, next) {
  var sql='select * from manager where `manager_id`=?;';
  var count_review = 'select count(*) as cnt from review where `market_name`=? and `sijang_name`=?;';
  var count_stamp = 'select count(*) as cnt2 from stamp where `market_name`=? and `sijang_name`=?;';
  var marketSql = 'SELECT * FROM `manager` ORDER BY like_count DESC ;';

  if(! req.session.authId) {
    res.redirect('/start');
  }
  else {

    conn.query(sql,[req.session.authId],function(error,results,fields){
      if(error){
        console.log(error);
      }
      else{
        conn.query(count_review,[results[0].market_name,results[0].sijang_name],function(err,results2,fields){
          if(err){
            console.log('mainMananger error');
          }else{
            conn.query(count_stamp,[results[0].market_name,results[0].sijang_name],function(errr,results3,fields){
              if(errr){
                console.log('mainmanager errr');
              }else{
                conn.query(marketSql, function(marketErr, marketRows) {
                  if(marketErr) {
                    console.log(marketErr);
                    console.log('marketSql err');
                  }
                  else {
                    console.log(results2);
                    res.render('mainManager', {
                      admin_name: req.session.authId,
                      results : results,
                      results2 : results2[0],
                      results3 : results3[0],
                      market: marketRows
                    });
                  }
                });
              }
            })
          }
        });
      }
    })

  }


});

router.get('/mystore', function(req, res){
  var sql='select * from manager where `manager_id`=?;';
  var sql_stamp = 'select * from `review` where `market_name`=? and `sijang_name`=? order by `id` desc ;';
  conn.query(sql,[req.session.authId],function(error,result1,fields){
    if(error){
      console.log(error);
    }else{
      conn.query(sql_stamp,[result1[0].market_name, result1[0].sijang_name],function(err,result2,fields){
        if(err){
          console.log(err);
        }else if(! result2.length){
          console.log("해당 가게 리뷰가 없는 경우");
          res.render('mystore',{
            result1 : result1,
            review : undefined
          });
        }else{
          console.log("해당가게 리뷰 있음");
          var rateAvgSql = 'select sijang_name, market_name, round(avg(rate),0) as rateAvg, count(*) as rateCnt from review where sijang_name=? and market_name=? group by sijang_name, market_name;' ;
          conn.query(rateAvgSql, [result1[0].sijang_name, result1[0].market_name], function(avgErr, avgRows) {
            if(avgErr) {
              console.log(avgErr);
              console.log('해당 가게 리뷰 평균 에러');
            }
            else {
              console.log(avgRows);
              res.render('mystore',{
                result1 : result1,
                review : result2,
                avgRows: avgRows[0]
              });
            }
          });
        }
      })
    }
  })
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
  var sqlJoin = 'SELECT stamp.id, stamp.user_id, stamp.sijang_name, stamp.market_name, stamp.stamp_count, stamp.stamp_standard, stamp.stamp_password, stamp.stamp_reward, likeMarket.like_check ,manager.like_count, manager.market_introduce, manager.market_promotion, manager.manager_image FROM stamp INNER JOIN manager ON stamp.sijang_name=manager.sijang_name and stamp.market_name=manager.market_name INNER JOIN likeMarket ON manager.sijang_name=likeMarket.sijang_name and manager.market_name=likeMarket.market_name and stamp.user_id=likeMarket.user_id WHERE stamp.user_id=?;';
  var sql2 = 'select * from `review` order by `id` desc ;';
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
        conn.query(sql2, function(error2, results){
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
            // var rateAvgSql = 'select sijang_name, market_name, round(avg(rate),0) as avgRateInt, round(avg(rate),1) as avgRate, count(*) as rateCnt from review group by sijang_name, market_name ;';
            var rateAvgSql = 'SELECT stamp.sijang_name, stamp.market_name, IFNULL(round(avg(rate),0), 0) as avgRate, count(review.user_id) as rateCnt FROM stamp LEFT OUTER JOIN review ON stamp.sijang_name=review.sijang_name and stamp.market_name=review.market_name WHERE stamp.user_id=? GROUP BY stamp.sijang_name, stamp.market_name ;' ;
            conn.query(rateAvgSql, [req.user.id], function(avgErr, avgRows) {
              if(avgErr) {
                console.log(avgErr);
                console.log('평점 평균 쿼리 에러');
              }
              else {
                console.log(avgRows);
                res.render('myStamp', {
                  user: req.user,
                  myStamps: result,
                  review : results,
                  avgOfRate: avgRows
                });
              }
            });
          }
        }
      });
      }
    }
  });
});

router.post('/myStamp', function(req, res) {

  var market_name = req.body.market_name;

  if(market_name){ // NewGoo ~ table에서 구 선택시 오는 부분
    var sql = "SELECT * FROM `review` WHERE `market_name` LIKE '"+market_name+"' ORDER BY `id` DESC";
    conn.query(sql, function(error, rows, fileds) {
      var avgSql = 'select round(avg(rate),0) as rateAvg, count(*) as rateCnt from review where market_name=? group by sijang_name, market_name ;';
      conn.query(avgSql, [market_name], function(avgErr, avgRows) {
        if(avgErr) { console.log(avgErr); }
        else {
          console.log(avgRows);
          return res.send({
            rows: rows,
            rateAvgAndCnt: avgRows[0],
          });
        }
      });
    });// conn.query
  }

}); // myStamp ~ post 라우팅

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
  var rate = req.body.rate;
  var provider = req.user.provider;
  var username = req.user.username;
  var sql = 'insert into `review`(`user_id`,`market_name`,`sijang_name`,`review`,`date`, `rate`, `username`, `provider`) values (?,?,?,?,?,?,?,?);';
  // var sql = 'select * from stamp where user_id =? and market_name = ?';
  console.log(user_id);
  conn.query(sql,[user_id, market_name, sijang_name, review, date, rate, username, provider],function(error,results,fields){
    if(error){
      console.log('er');
    }else{
      res.send({
        result : 'success'
      });
    }
  })
});

router.post('/review_manager',function(req,res,next){
  var user_id = req.body.user_id;
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var date = req.body.date;
  var review = req.body.review;
  var provider = 'marketOlleh';
  var username = '사장님';
  var sql = 'insert into `review`(`user_id`,`market_name`,`sijang_name`,`review`,`date`, `username`, `provider`) values (?,?,?,?,?,?,?);';
  // var sql = 'select * from stamp where user_id =? and market_name = ?';
  console.log(user_id);
  conn.query(sql,[user_id,market_name,sijang_name,review,date, username, provider],function(error,results,fields){
    if(error){
      console.log('er');
    }else{
      res.send({
        result : 'success'
      });
    }
  })
});

// hw edit / 상점에 좋아요가 되어 있는지 체크
router.post('/likeCheck', function(req, res) {
  var user_id = req.body.user_id;
  var sijang_name = req.body.sijang_name;
  var market_name = req.body.market_name;
  var sql = 'select * from `likeMarket` where user_id = ? and market_name = ? and sijang_name = ?'

  conn.query(sql, [user_id,market_name,sijang_name], function(error, results){
    if(error) {
      console.log(error);
    } else if(results.length) {
      res.send({ // likeMarket의 like_check컬럼의 값 대조 필요
        result: 'exist',
        like_check_val: results[0].like_check
      });
    } else {
      res.send({
        result: 'not exist'
      });
    }
  }); // conn.query
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

/* 좋아요 취소 */
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

/* hw edit ~ main에서 동적으로 생성되는 stamp의 like 처리 */
router.post('/main_like/:manager_id', function(req, res) {

  // body parser values
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var like_count = req.body.like_count;

  // sql list
  var selectSql = 'select * from `likeMarket` where `user_id`=? and `sijang_name`=? and `market_name`=? ;';
  var insertSql = 'insert into `likeMarket` (`user_id`, `sijang_name`, `market_name`) values (?, ?, ?) ;';
  var likeUpdateSql = 'UPDATE manager INNER JOIN likeMarket ON likeMarket.sijang_name=manager.sijang_name and likeMarket.market_name=manager.market_name SET likeMarket.like_check=?, manager.like_count=? WHERE likeMarket.user_id=? and manager.manager_id=? ;'; // update likeMarket query

  conn.query(selectSql, [req.user.id, sijang_name, market_name], function(selectErr, selectRows) {
    if(selectErr) {
      console.log(selectErr);
      console.log('select likeMarket table failed');
    }
    else if(selectRows.length) {
      // 이미 likeMarket DB에 튜플이 존재
      console.log('likeMarket 조회 성공');
      conn.query(likeUpdateSql, [1, like_count, req.user.id, req.params.manager_id], function(likeErr, likeRows) {
        if(likeErr) { console.log(likeErr); }
        else {
          // 조회까지 성공,
          // 이미 likeMarket에 튜플 존재한 흔적 O --> Update만 해주자
          var likeCountSql = 'select * from `manager` where `manager_id`=? ;';
          conn.query(likeCountSql, [req.params.manager_id], function(lCErr, lCRows) {
            if(lCErr) { console.log(lCErr); }
            else {
              console.log('조희 ~ likecount 까지 성공, 리턴값 발사');
              // 결과 값은 manager DB에서 해당하는 매니저 ID를 가진 튜플의
              // 좋아요 개수를 가져옴
              res.send({
                result: "success",
                like_count: lCRows[0].like_count
              });
            }
          }); // likeCountSql
        }
      }); // likeUpdateSql
    }
    else {
      // likeMarket DB에 튜폴 XXX --> 새로 insert into 해야함
      console.log('likeMarket 조회 성공 but 결과 값 없음');
      conn.query(insertSql, [req.user.id, sijang_name, market_name], function(insertErr, insertRows) {
        if(insertErr) {
          console.log(insertErr);
          console.log('insert likeMarket table failed');
        }
        else {
          // insert (데이터 삽입까지 성공)
          console.log('likeMarket 테이블 삽입 성공');
          conn.query(likeUpdateSql, [1, like_count, req.user.id, req.params.manager_id], function(likeErr, likeRows) {
            if(likeErr) { console.log(likeErr); }
            else {
              var likeCountSql = 'select * from `manager` where `manager_id`=? ;';
              conn.query(likeCountSql, [req.params.manager_id], function(lCErr, lCRows) {
                if(lCErr) { console.log(lCErr); }
                else {
                  res.send({
                    result: "success",
                    like_count: lCRows[0].like_count
                  });
                }
              }); // likeCountSql
            }
          }); // likeUpdateSql
        }
      }); // insertSql
    }
  }); // selectSql
});

router.post('/main_dislike/:manager_id', function(req, res) {

  // body parser values
  var like_count = req.body.like_count;

  // sql list
  var dislikeUpdateSql = 'UPDATE manager INNER JOIN likeMarket ON likeMarket.sijang_name=manager.sijang_name and likeMarket.market_name=manager.market_name SET likeMarket.like_check=?, manager.like_count=? WHERE likeMarket.user_id=? and manager.manager_id=? ;';

  conn.query(dislikeUpdateSql, [0, like_count, req.user.id, req.params.manager_id], function(likeErr, likeRows) {
    if(likeErr) { console.log(likeErr); }
    else {
      var selectSql = 'select * from `manager` where `manager_id`=? ;';
      conn.query(selectSql, [req.params.manager_id], function(selErr, selRows) {
        res.send({
          result: "success",
          like_count: selRows[0].like_count
        });
      }); // selectSql
    }
  }); // dislikeUpdateSql
});

/* 스탬프 삭제 */
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
  var manager_image = req.body.manager_image;


  var update_manager_sql = 'update manager set stamp_reward = ?, stamp_password = ?, market_introduce =?, market_promotion =?, manager_image=? where manager_id = ?';
  var update_stamp_sql ='update stamp set stamp_reward = ?,stamp_password = ? where sijang_name = ? and market_name =?';
  conn.query(update_manager_sql,[stamp_reward, stamp_password, market_introduce, market_promotion,manager_image, manager_id],function(error,result,fields){
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
//쿠폰센드

router.post('/send_sijang_name', function(req, res) {
  var sql = 'select * from coupon_manager where sijang_name = ?;';
  var sijang_name = req.body.sijang_name;
  conn.query(sql, [sijang_name], function(err, results) {
    if(err) {
      console.log('센드시장에러');
    }
    else{
      res.send({
        result: 'success',
        results : results,
       });
    }
  });
});

//

router.post('/coupon_customer', function(req, res) {
  var market_name = req.body.market_name;
  var sijang_name = req.body.sijang_name;
  var user_id = req.body.user_id;
  var coupon_password = req.body.coupon_password;
  var coupon_reward = req.body.coupon_reward;
  var coupon_standard = req.body.coupon_standard;
  var sql1 = "select * from coupon_customer where sijang_name=? and market_name =? and user_id=?;";
  var sql2 = "insert into `coupon_customer` (`user_id`, `sijang_name`, `market_name`,`coupon_password`, `coupon_reward`, `coupon_standard`) values (?, ?, ?, ?, ?, ?) ;"
  conn.query(sql1, [sijang_name, market_name, user_id], function(err, result) {
    if(err) {
      console.log('센드시장에러');
    }else if(result.length){
      console.log('fail에 들어옴');
      res.send({
        result : 'fail',
        results : undefined
      })
    }
    else{
      conn.query(sql2, [user_id,sijang_name,market_name,coupon_password,coupon_reward,coupon_standard],function(error,results){
        console.log('success 들어옴');
        res.send({
          result: 'success',
          results : results,
         });
      })
    }
  });
});

router.post('/decreasecoupon', function(req, res) {
  var sql = 'select coupon_count from coupon_manager where sijang_name = ? and market_name = ?;';
  var sijang_name = req.body.sijang_name;
  var market_name = req.body.market_name;
  var decrease_coupon_count = 'update coupon_manager set coupon_count = coupon_count -1 where sijang_name = ? and market_name = ?;';
  var delete_coupon_count = 'delete from coupon_manager where sijang_name = ? and market_name = ?;';
  conn.query(sql, [sijang_name,market_name], function(err, results) {
    if(err) {
      console.log('decreasecouponcount error');
    }
    else if(results[0].coupon_count == 1){
      conn.query(delete_coupon_count,[sijang_name,market_name],function(error,results2){
        console.log('sql = delete_coupon_count');
        res.send({
          result: 'delete',
          results : results,
          results2 : results
         });
      })
    }
    else {
      conn.query(decrease_coupon_count,[sijang_name, market_name],function(error, results3){
        console.log('sql = decrease_coupon_count');
        console.log(results[0].coupon_count);
        res.send({
          result: 'decrease',
          results : results,
          results3 : results,
         });
      })
    }
  });
});



module.exports = router;
