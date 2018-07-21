var back_number = prompt("배경테마 선택 1=과일 2=채소 3=기본테마", "");
if (back_number == 1) {
    $('#stamp_sj').css({ "background": "url(/images/backSample1.png)", 'background-repeat': 'no-repeat', 'background-size': 'cover' });
}
else if (back_number == 2) {
    $('#stamp_sj').css({ "background": "url(/images/backSample2.png)", 'background-repeat': 'no-repeat', 'background-size': 'cover' });
}
else if (back_number == 3) {
    $('#stamp_sj').css({ "background": "url(/images/backSample3.png)", 'background-repeat': 'no-repeat', 'background-size': 'cover' });
}
if (stamp_standard == 0) {
    $('#fiveControls_sj').css('display', 'table');
    for (var i = 0; i < stamp_count; i++) {
        var check = document.getElementsByClassName('five_sj')[i];
        check.style.backgroundColor = "#232323";
    }
}

if (stamp_standard == 1) {
    $('#tenControls_sj').css('display', 'table');
    for (var i = 0; i < stamp_count; i++) {
        var check = document.getElementsByClassName('ten_sj')[i];
        check.style.backgroundColor = "#232323";
    }
}


var good = document.getElementById('goodCount_sj');
$('#noGood_Button_sj').click(function () {
    $(this).css('display', 'none');
    $('#yesGood_Button_sj').css('display', 'block');
    good.innerHTML = "216";
})
$('#yesGood_Button_sj').click(function () {
    $(this).css('display', 'none');
    $('#noGood_Button_sj').css('display', 'block');
    good.innerHTML = "215";
})

$('#stamp_sj').click(function () { //쿠폰 클릭시 이벤트 발생
    stamp_count_password();
})
function stamp_count_password() {
  var stamp_count_password_number = prompt("비밀번호를 입력하세요", "");
  var data = {
    'market_name': market_name,
    'user_id': user_id
  }
  $.ajax({
      type: 'POST',
      url: '/stamp_count_password',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      cache: false,
      dataType: 'json',
      data: data,
      success: function (result) {
          if (result['password'] == stamp_count_password_number) {

              alert('비밀번호 일치');
              coupon_count();
          
          }else{
            alert('비밀번호 불일치');
            $(window).attr('location', '/myStamp');
          }
      },
      error: function (error) {
          console.log('error');
      }
  });
}
function coupon_count() {
    if (parseInt(stamp_standard) >= parseInt(new_stamp_count)) {
        var data = {
            'stamp_count': new_stamp_count,
            'market_name': market_name,
            'user_id': user_id
        };
        $.ajax({
            type: 'POST',
            url: '/aboutstamp_count',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            cache: false,
            dataType: 'json',
            data: data,
            success: function (result) {
                if (result['result'] == 'success') {
                    alert('스탬프추가');
                    // alert(stamp_count);
                    $(window).attr('location', '/myStamp');
                }
            },
            error: function (error) {
                console.log('error');
            }
        });
    }
    else {
        var data = {
            'stamp_count': reset_stamp_count,
            'market_name': market_name,
            'user_id': user_id
        };
        $.ajax({
            type: 'POST',
            url: '/reset_aboutstamp_count',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            cache: false,
            dataType: 'json',
            data: data,
            success: function (result) {
                if (result['result'] == 'successs') {
                    alert('초기화');
                    $(window).attr('location', '/myStamp');
                }
            },
            error: function (error) {
                console.log('error');
            }
        });
    }
}
