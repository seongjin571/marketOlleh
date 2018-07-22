var back_number = prompt("배경테마 선택 1=과일 2=채소 3=기본테마", "");
var password_number_array_sj = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

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

$('#stamp_sj').click(function () {
    count=0; //쿠폰 클릭시 이벤트 발생
    $('#stamp_menu_sj').hide(200);
    $('#password_number_div_sj').show(200);

    shuffle(password_number_array_sj);
    for(var i=0; i<10; i++){
        document.getElementsByClassName('password_number_sj')[i].innerHTML=password_number_array_sj[i];
    }
    if(count==0){
    $('.password_number_sj').click(function(){
        var number=$(this).html();
        count=1;
        if(count==1){
            $('.password_number_sj').click(function(){
                var number2=number+$(this).html();
                count=2;
                if(count==2){
                    $('.password_number_sj').click(function(){
                        var number3=number2+$(this).html();
                        count=3;
                        if(count==3){
                            $('.password_number_sj').click(function(){
                                var number4=number3+$(this).html();
                                    stamp_count_password(number4);
                            })
                        }
                    })
                }
            })
        }
    })
}

   $('#password_cancel').click(function(){

    $('#password_number_div_sj').hide(200);
    $('#stamp_menu_sj').show(200);
   })


})
function stamp_count_password(number4) {
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
            if (result['password'] == number4) {

                alert('비밀번호 일치');
                coupon_count();

            } else {
                alert('비밀번호 불일치');
                location.reload();
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
                    $(window).attr('location', '/marketOlleh/myStamp');
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
                    $(window).attr('location', '/marketOlleh/myStamp');
                }
            },
            error: function (error) {
                console.log('error');
            }
        });
    }
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
