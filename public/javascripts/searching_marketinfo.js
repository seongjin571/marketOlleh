// 만들어 진 후 CSS 동적 제어
function NewGoomapLi_css() {
	$("#market_infor > article").css('display', 'block');
	// $(".market_infoText_li").css('margin', '10px');
	$(".market_main_image >img").css('width', '90%').css('margin-left','5%');
	$("#buffering_img").css('width', '120px').css('height', '120px').css('margin-top', '0%').css('margin-left', '0 auto').css('border-style','none');
}

function marketInfoLi_event(market_arr) { // market_arr는 market DB값

	// 좋아요순 상점 흔적 없애기
	if ($('#hot_store_list_market > div')) {
		$('#hot_store_list_market > div').remove();
		$('#hot_store_list_market').html('<img src="/images/buffering-dial.gif" id="buffering_img" />');
	}

	// 태그 동적으로 생성하기
	var tempString = new Array();
	var fullString = '';

	tempString[0] = '<div> <h3 id="market_name_searching">'+market_arr.name+'</h3></div>';
		// 시장 img URL 존재 하면 표시
		if (market_arr.imgurl) {
			tempString[1] = '<div  class="market_main_image"> <img src="'+market_arr.imgurl+'"></div><div class="line"></div>';
		} else { // 존재 안하면 디폴트 이미지
			tempString[1] = '<div class="market_main_image"> <img src="/images/market_default.jpg"></div><div class="line"></div>';
		}
	tempString[2] = '<div class="market_infoText_li"><img src="/images/type.png" width="30px" height="30px"><p class="naming">유형</p><div class="content_div">'+market_arr.shape+','+market_arr.dealing+'</div></div>';
	// tempString[4] = '<div class="market_infoText_li"> <a href='+market_arr.web+'>시장 링크</a></div>';
	tempString[3] = '<div class="market_infoText_li"><img src="/images/location3.png" width="30px" height="30px"><p class="naming">주소</p><div class="content_div">'+market_arr.oldaddress+'</div></div>';
	tempString[4] = '<div class="market_infoText_li"><img src="/images/phone.png" width="30px" height="30px"><p class="naming">전화번호</p><div class="content_div">'+market_arr.callnum+'</div></div>';
	// tempString[7] = '<div class="market_infoText_li"> 시장 대표 품목 : '+market_arr.representative+'</div>';
	tempString[5] = '<div class="market_infoText_li"><img src="/images/traffic.png" width="30px" height="30px"><p class="naming">교통편</p><div class="content_div">'+market_arr.nearinfo+'</div></div><div class="line"></div>';

	// 임시 배열 text 하나로 합치고 넣기
	for (var index in tempString) {
		fullString += tempString[index];
	} // for in


	market_infoText.innerHTML = fullString;

	// CSS 나중 적용
	NewGoomapLi_css();

	// MAP API
	relayout();
	setMarkers(null); // 마커 배열 감추기
	changeCenter(market_arr.coordinateX, market_arr.coordinateY);

	// 인기 상점 찾기
	$.ajax({
		url: "/searching/marketList",
		dataType: 'json',
		type: 'POST',
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data: { "name": market_arr.name },
		success: function (result) {
			console.log(result);
			if (result.rows.length > 0) {
				marketInfoLi_event_likelist(result.rows);
			} else {
				console.log("현재 해당하는 시장에 등록된 상점이 없음");
			}
		},
		error: function (e) {
			alert("searching_marketinfo.js 에러");
			console.log('process error : ', e);
		}
	}); // ajax

} // marketInfoLi_event

function managerInfoLi_event(market_arr) { // market_arr는 manager DB값

	// 스크롤 조절
	window.scrollTo(0, 0);

	// 시장 정보 vs 상인 정보
    $('#store_infor').css('display', 'block');
    $('#market_infor').css('display', 'none');
    console.log(market_arr);

    // manager DB ~ 상점 DB 내용 뿌려주기
    // 시장 이름, 상점 이름, 좋아요 카운트
    $('#store_name_sj').text(market_arr.market_name);
    $('#market_name_sj').text(market_arr.sijang_name);
    $('#goodCount_sj').text(market_arr.like_count);


		var count=0;

		// $('.face').click(function() {
		// 	count=1;
		// 	if(count==1){
		// 	var shareUrl = 'http://18.219.181.225:3000/share/' + market_arr.sijang_name.replace(/ /gi, '%20') + '\/' + market_arr.market_name.replace(/ /gi, '%20');
		// 	window.plugins.socialsharing.shareViaFacebook(null, null, shareUrl, function() {console.log('share ok')}, function(errormsg){
		// 		//alert(errormsg)
		// 		var goToPlayStoreConfirm = confirm('a본 기능은 해당 기기에 페이스북 어플리케이션이 있어야 실행이 가능합니다. 앱을 설치하시겠습니까?');
	  //     if(goToPlayStoreConfirm) {
		// 	  count=0;
	  //       window.location.href = 'https://play.google.com/store/apps/details?id=com.facebook.katana';
		//   }
		//   else{
		// 	  count++;
		//   }
		// 	});
		// 	// window.plugins.socialsharing.shareVia('com.facebook.katana', null, null, null, shareUrl, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
		// }
		// });



    // 지금 이 함수를 불러오게 하는 user_id가
    // 그 스탬프(상점)의 따봉을 눌렀는지(likeMarket에 존재하는지) 테스트
	$.ajax({
		type: 'POST',
		url: '/likeCheck',
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		cache: false,
		dataType: 'json',
		data: {
			'market_name' : market_arr.market_name,
			'sijang_name' : market_arr.sijang_name,
			'user_id' : user_id, // 전역변수 user_id
		},
		success: function (result) {
		  if (result['result'] == 'exist' && result['like_check_val'] == 1) {
		  	$('#noGood_Button_sj').css('display', 'none');
	        $('#yesGood_Button_sj').css('display', 'inline-block');
		  } else if(result['result']=='not exist' || result['like_check_val'] == 0){
		  	$('#yesGood_Button_sj').css('display', 'none');
		  	$('#noGood_Button_sj').css('display', 'inline-block');
		  }
		},
		error: function (error) {
		  console.log('erer');
		}
	}); // ajax

    // 좋아요 기능, click 함수 추가
    likeCount_function(market_arr);

    // 스탬프 관련 내용
	var temp ='<div class="stamp_infor">'
	temp += '<img src="/images/standard.png" width="30px" height="30px">'
	temp +='<div class="name">적립기준</div>'
	temp +='<div class="stamp_infor_content">'+market_arr.market_promotion+'</div></div>'
	temp +='<div class="stamp_infor">'
	temp += '<img src="/images/rewardM.png" width="30px" height="30px">'
	temp +='<div class="name">보상</div>'
	temp +='<div class="stamp_infor_content">'+market_arr.stamp_reward+'</div></div>'
    $('#stamp_infor_sj').html(temp);


    // 스탬프 부분 표현
    if (market_arr.stamp_standard == 5) { // 쿠폰 개수 5개
    	$('.tenControls_sj').css('display', 'none');
    	$('.fiveControls_sj').css('display', 'table');
    }else { // 쿠폰 개수 10개
    	$('.fiveControls_sj').css('display', 'none');
    	$('.tenControls_sj').css('display', 'table');
    }

    // 다운 받기 버튼 ~ 스탬프 있으면 버튼 안보이게
	$('.button_sj').click(function(){

		var data = {
		'market_name' : market_arr.market_name,
		'sijang_name' : market_arr.sijang_name,
		'user_id' : user_id, // 전역변수 user_id
		'stamp_count' : 0,
		'stamp_standard' : market_arr.stamp_standard,
		'stamp_reward' : market_arr.stamp_reward,
		'stamp_password' : market_arr.stamp_password,
		};

		$.ajax({ // ajax 통신으로 지원자 입력한 정보를 서버에 보낸다.
			type: 'POST',
			url: '/make_stamp',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			cache: false,
			dataType: 'json',
			data: data,
			success: function (result) {
			  if (result['result'] == 'success') {
				$('.alert_o').css('display', 'block');
				$('.alert_content').html('다운받기 완료되었습니다.')
				$('.alert_o').click(function () {
				location.reload();
				});
			  } else if(result['result']=='already'){
			    $('.alert_x').css('display', 'block');
                $('.alert_content').html('이미 해당 스탬프가 있습니다.')
			    // location.reload();
			  }
			},
			error: function (error) {
			  console.log('erer');
			}
		}); // ajax

	}); // download button function

    // 상점 소개와 위치
    $('#intro_content').text(market_arr.market_introduce);
		$('.store_image').css({ "background": "url("+ market_arr.manager_image +")", 'background-repeat': 'no-repeat', 'background-position': 'center center', 'background-size': '155%' });

	// 리뷰, 앞에 있던 정보들 초기화
	if ($('.review_div_sj > div')) {
		$('.review_div_sj').remove();
	}

    // 리뷰 ajax
	$.ajax({
		url: "/myStamp",
		dataType: 'json',
		type: 'POST',
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data: { "market_name": market_arr.market_name },
		success: function (result) {
			console.log(result);
			if (result.rows.length > 0) {
				managerInfoLi_event_review(result.rows, result.rateAvgAndCnt, market_arr.market_name);
			} else {
				console.log("현재 해당하는 시장에 등록된 리뷰가 없음");
				managerInfoLi_event_review(0, 0, market_arr.market_name);
			}
		},
		error: function (e) {
			alert("Error!");
			console.log('process error : ', e);
		}
	}); // ajax

	making_correct_map(market_arr);

} // managerInfoLi_event

function likeCount_function(market_arr) {

	// 한글 꺠짐 문제 방지 (차후 문제)
	var managerID = market_arr.manager_id;

    /*  좋아요  */
    $('#noGood_Button_sj').click(function () {
      var getNow_likeCount = goodCount_sj.innerText;
      var data = {
        'market_name' : market_arr.market_name,
        'sijang_name' : market_arr.sijang_name,
        'like_count' : parseInt(getNow_likeCount)+1
      };

	  $.ajax({
		type: 'post',
	 	url: '/main_like/'+managerID, // user_id는 전역변수
	    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	    cache: false,
	    data: data,
	    datatype: 'json',
	    success: function(result) {
	      if (result['result'] == 'success'){
	        $('#noGood_Button_sj').css('display', 'none');
	        $('#yesGood_Button_sj').css('display', 'inline-block');
	        $('#goodCount_sj').text(result['like_count']);
	      }
	    },
	    error: function(error){
	      console.log(error);
	      console.log('좋아요 실패');
	    }
	  });
	});

    /* 좋아요 취소 */
    $('#yesGood_Button_sj').click(function () {
      var getNow_likeCount = goodCount_sj.innerText;
      var data = {
        'like_count' : parseInt(getNow_likeCount)-1
      };

      $.ajax({
        type: 'post',
        url: '/main_dislike/'+managerID, // user_id는 전역변수
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        cache: false,
        data: data,
        datatype: 'json',
        success: function(result) {
	      if (result['result'] == 'success'){
	        $('#noGood_Button_sj').css('display', 'inline-block');
	        $('#yesGood_Button_sj').css('display', 'none');
	        $('#goodCount_sj').text(result['like_count']);
	      }
        },
        error: function(error){
	      console.log(error);
          console.log('좋아요 취소 실패');
        }
      });
    });

} // likeCount_function

function marketInfoLi_event_likelist(result_rows) {

	// 좋아요 순서로 정렬 --> SQL에서 ORDER ~ DESC 로 수정
	// result_rows.sort(function (a, b) {
	// 	return a.like_count < b.like_count ? 1 : a.like_count > b.like_count ? -1 : 0;
	// });

	// 태그 동적으로 생성하기
	var tempString = new Array();
	var fullString = '';

	// [ main.ejs ] 의 [ id = hot_store_list_market ] 참고
	for (var i = 0; i <10; i++) {

		if (result_rows[i]) {

			// 2개씩 div 태그로 묶어주기
			if (i%2 == 0) {
				if (i == 0) { // 처음 실행 ~ div 닫기 태그 X
					tempString[i] = '<div>';
					tempString[i] += '<div class="hot_store_detail_market">';
					tempString[i] += '<div><img src="' + result_rows[i].manager_image + '" width="100%" height="130px"> </div>';
					tempString[i] += '<div class="good_store_name_market">'+result_rows[i].market_name+'</div>';
					tempString[i] += '<div class="good_count_market"><img src="/images/good.png" width="20px" height="20px"><p>'+result_rows[i].like_count+'</p></div>'
					tempString[i] += '</div>';
				} else {
					tempString[i] = '</div><div>';
					tempString[i] += '<div class="hot_store_detail_market">';
					tempString[i] += '<div><img src="' + result_rows[i].manager_image + '" width="100%" height="130px"> </div>';
					tempString[i] += '<div class="good_store_name_market">'+result_rows[i].market_name+'</div>';
					tempString[i] += '<div class="good_count_market"><img src="/images/good.png" width="20px" height="20px"><p>'+result_rows[i].like_count+'</p></div>'
					tempString[i] += '</div>';
				} // inner if ~ else
			} else {
				tempString[i] = '<div class="hot_store_detail_market">';
				tempString[i] += '<div><img src="' + result_rows[i].manager_image + '" width="100%" height="130px"> </div>';
				tempString[i] += '<div class="good_store_name_market">'+result_rows[i].market_name+'</div>';
				tempString[i] += '<div class="good_count_market"><img src="/images/good.png" width="20px" height="20px"><p>'+result_rows[i].like_count+'</p></div>'
				tempString[i] += '</div>';
			} // inner if ~ else

		} // IF 

	} // for

	// 임시 배열 text 하나로 합치고 넣기
	for (var index in tempString) {
		fullString += tempString[index];
	} // for in

	// last close of div tag
	fullString += '</div>'

	// 만든 동적 String tag / 배열 삽입, 태그 HTML + CSS 수정
	hot_store_list_market.innerHTML = fullString;
	$('#hot_store_list_market > div').css('display', 'flex');

	// 인기 상점 click ~ managerInfoLi_event ~ 상점 정보 (스탬프)
	$('.hot_store_detail_market').click(function (event) {
		for (var i = 0; i < result_rows.length; i++) {
			if (result_rows[i].market_name == this.childNodes[1].innerText) {
				managerInfoLi_event(result_rows[i]);
				break;
			} // inner if
		} // for
	}); // class ~ arr ~ click fun dv


} // marketInfoLi_event_likelist

function managerInfoLi_event_review(review_arr, avg_and_cnt, MarketName) {

	// 날짜 순서로 정렬 --> SQL에서 ORDER ~ DESC 로 수정
	// review_arr.sort(function (a, b) {
	// 	return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
	// });
	// console.log(review_arr[0].market_name);
	// 태그 동적으로 생성하기
	var tempString = new Array();
	var fullString = '';


	if(! review_arr) { // 리뷰가 없을때
		fullString += '<div class="review_rate">';
		fullString += '<div class="review_star">';

		for(var j=0; j< 5; j++) {
			fullString += '<div>';
			fullString += '<img class="star_gray_customer" src="/images/star_gray.png" width="30px" height="30px">';
			fullString += '</div>';
		}
		fullString += '</div></div>';


		fullString += '<div class="review_count">';
		fullString += '<p style="font-size: 20px; color: #9c9c9c;">작성된 리뷰가 없습니다. </p>';
		fullString += '</div>';
		fullString += '<div id="intro"><p> '+MarketName+' 상점을 이용하는 고객들의 리뷰입니다.</p></div>';
		fullString += '<div class="line"></div>'; // 그리드 라인표시 div
	}

	else { // 리뷰가 존재할때
		fullString += '<div class="review_rate">';
		fullString += '<div class="review_star">';
		for(var j=0; j< avg_and_cnt.rateAvg; j++) {
			fullString += '<div>';
			fullString += '<img class="star_yellow_customer" src="/images/star_yellow.png" width="30px" height="30px">';
			fullString += '</div>';
		}
		for(var j=0; j< 5-avg_and_cnt.rateAvg; j++) {
			fullString += '<div>';
			fullString += '<img class="star_gray_customer" src="/images/star_gray.png" width="30px" height="30px">';
			fullString += '</div>';
		}
		fullString += '</div>';

		fullString += '<div class="review_count">';
		fullString += '<p class="review_count_content">' + avg_and_cnt.rateCnt + '</p>';
		fullString += '<p style="font-size: 20px; color: #9c9c9c;"> 개의 리뷰가 있습니다 </p>';
		fullString += '</div>';
		fullString += '<div id="intro"><p> '+MarketName+' 상점을 이용하는 고객들의 리뷰입니다.</p></div>';
		fullString += '<div class="line"></div>'; // 그리드 라인표시 div
		fullString += '</div>';


		for( var i = 0; i<review_arr.length; i++){
			tempString[i] = '<div class="review_div_sj">';


			tempString[i] += '<div class="review_star_customer">';

			if(review_arr[i].user_id != '사장님') {
				for(var j=0; j< review_arr[i].rate; j++) {
					tempString[i] += '<div>';
					tempString[i] += '<img class="star_yellow_customer" src="/images/star_yellow.png" width="20px" height="20px">';
					tempString[i] += '</div>';
				}

				for(var j=0; j< 5-review_arr[i].rate; j++) {
					tempString[i] += '<div>';
					tempString[i] += '<img class="star_gray_customer" src="/images/star_gray.png" width="20px" height="20px">';
					tempString[i] += '</div>';
				}
			}
			else{
				tempString[i] += '<div>';
				tempString[i] += '<img class="star_gray_customer" src="/images/logo_with_text_small.png" width="60px" height="15px">';
				tempString[i] += '</div>';
			}

			tempString[i] += '</div>';
			tempString[i] += '<div class="review_content_sj">';

			if(review_arr[i].provider == 'kakao') {
				tempString[i] += '<div class="review_content_id_sj"><b>'+review_arr[i].username+'</b></div>';
			}
			else {
				var temp_ = review_arr[i].user_id;
				var secret = '***';
				var l = temp_.length;
				var f = l-3;
				var temp2 = temp_.substring(0,f);
				var result3 = temp2.concat(secret);
				if(result3 == '***') {
					tempString[i] += '<div class="review_content_id_sj"><b>사장님</b></div>';
				}
				else {
					tempString[i] += '<div class="review_content_id_sj"><b>'+result3+'</b></div>';
				}
			}

			tempString[i] += '<div class="review_content_date_sj">'+review_arr[i].date+'</div></div>';
			tempString[i] += '<p>'+review_arr[i].review+'</p>';
			tempString[i] += '<div class="line"></div>';
			tempString[i] += '</div>';
		}

		// 임시 배열 text 하나로 합치고 넣기
		for (var index in tempString) {
			fullString += tempString[index];
		} // for in
	}

    $('.store_review_sj').html(fullString);

} // managerInfoLi_event_review

function making_correct_map(market_arr) {
	// if no right map --> make correct map
	var tempLo = market_arr.market_location;
    tempLo = tempLo.split(', ');
    // 지도를 표시할 div (id)
    var mapContainer = document.getElementById('manager_Map'),
        mapOption = {
            center: new daum.maps.LatLng(parseFloat(tempLo[0]), parseFloat(tempLo[1])), // 지도의 중심좌표
            level: 4 // 지도의 확대 레벨
        };
    var manager_Map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    // 마커 하나를 지도위에 표시합니다
    addMarkerGPS(new daum.maps.LatLng(parseFloat(tempLo[0]), parseFloat(tempLo[1])), manager_Map);
    manager_Map.relayout();
}
