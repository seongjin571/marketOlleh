var back_number = prompt("배경테마 선택 1=과일 2=채소", "");
if (back_number == 1) {
    $('#stamp_sj').css({ "background": "url(/images/backSample1.png)", 'background-repeat': 'no-repeat', 'background-size': 'cover' });
}
else if (back_number == 2) {
    $('#stamp_sj').css({ "background": "url(/images/backSample2.png)", 'background-repeat': 'no-repeat', 'background-size': 'cover' });
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
    coupon_count();
})

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
                    alert('1');
                    alert(stamp_count);
                    $(window).attr('location', '/main');
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
                    alert('2');
                    $(window).attr('location', '/main');
                }
            },
            error: function (error) {
                console.log('error');
            }
        });
    }
}