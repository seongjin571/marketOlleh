// 만들어 진 후 CSS 동적 제어
function NewGoomapLi_css() {
	$("#market_infor > article").css('display', 'block');
	$(".market_infoText_li").css('margin', '10px');
	$(".market_infoText_li > img").css('width', '100%');
}

function marketInfoLi_event(market_arr) {
	
	// 태그 동적으로 생성하기
	var tempString = new Array();
	var fullString = '';

	// tempString[0] = '<div class="market_infoText_li">'+market_arr.coordinateX+', '+market_arr.coordinateY+'</div>';
	tempString[0] = '<div class="market_infoText_li"> <h2>'+market_arr.name+'</h2></div>';
		// 시장 img URL 존재 하면 표시
		if (market_arr.imgurl) {
			tempString[1] = '<div class="market_infoText_li" id="market_image"> <img src="'+market_arr.imgurl+'"></div>';	
		} else { // 존재 안하면 디폴트 이미지
			tempString[1] = '<div class="market_infoText_li" id="market_image"> <img src="/images/market_default.jpg"></div>';
		}
	tempString[2] = '<div class="market_infoText_li"> <p>시장 유형 : '+market_arr.shape+','+market_arr.dealing+'</p></div>';
	// tempString[4] = '<div class="market_infoText_li"> <a href='+market_arr.web+'>시장 링크</a></div>';
	tempString[3] = '<div class="market_infoText_li"> <p>시장 주소 : '+market_arr.oldaddress+'</p></div>';
	tempString[4] = '<div class="market_infoText_li"> <p>시장 전화번호 : '+market_arr.callnum+'</p></div>';
	// tempString[7] = '<div class="market_infoText_li"> 시장 대표 품목 : '+market_arr.representative+'</div>';
	tempString[5] = '<div class="market_infoText_li"> <p>시장 교통편 : '+market_arr.nearinfo+'</p></div>';


	
	// 임시 배열 text 하나로 합치고 넣기
	for (var index in tempString) {
		fullString += tempString[index];
	} // for in 

	market_infoText.innerHTML = fullString;

	// CSS 나중 적용
	NewGoomapLi_css();

	// MAP API
	relayout();
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
			alert("Error!");
			console.log('process error : ', e);
		}
	}); // ajax	

} // marketInfoLi_event

function managerInfoLi_event(market_arr) {

    $('#store_infor').css('display', 'block');
    $('#market_infor').css('display', 'none');
    console.log(market_arr);
    var manager_id = market_arr.manager_id;
    var market_name = market_arr.market_name;
    var introduce = market_arr.market_introduce;
    var stamp_reward = market_arr.stamp_reward;
    var market_promotion = market_arr.market_promotion;
    var like_count = market_arr.like_count;
    alert(manager_id);
    
} // managerInfoLi_event

function marketInfoLi_event_likelist(result_rows) {

	result_rows.sort(function (a, b) {
		return a.like_count < b.like_count ? -1 : a.like_count > b.like_count ? 1 : 0;
	});

	// 태그 동적으로 생성하기
	var tempString = new Array();
	var fullString = '';

	for (var i = 0; i < result_rows.length; i++) {
		tempString[i] = '<div class="hot_store_detail_market"><div><img src="/images/market2.jpg" width="100%" height="100px"> </div> <div class="good_store_name_market">'+result_rows[i].market_name+'</div><div class="good_count_market"><img src="/images/good.png" width="20px" height="20px"><p>201</p></div>';		
	}

	// 임시 배열 text 하나로 합치고 넣기
	for (var index in tempString) {
		fullString += tempString[index];
	} // for in 

	hot_store_list_market.innerHTML = fullString;	
}
