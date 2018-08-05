// 만들어 진 후 CSS 동적 제어
function NewGoomapLi_css() {
	$("#market_infor > article").css('display', 'block');
	$(".market_infoText_li").css('margin', '10px');
	$(".market_infoText_li > img").css('width', '100%');
}

function marketInfoLi_event(market_arr) {

	console.log(market_arr);
	
	// 태그 동적으로 생성하기
	var tempString = new Array();
	var fullString = '';

	tempString[0] = '<div class="market_infoText_li">'+market_arr.coordinateX+', '+market_arr.coordinateY+'</div>';
	tempString[1] = '<div class="market_infoText_li"> 시장 이름 : '+market_arr.name+'</div>';
	tempString[2] = '<div class="market_infoText_li"> '+market_arr.shape+'</div>';
	tempString[3] = '<div class="market_infoText_li"> <a href='+market_arr.web+'>시장 링크</a></div>';
	tempString[4] = '<div class="market_infoText_li"> 시장 지번 : '+market_arr.oldaddress+'</div>';
	tempString[5] = '<div class="market_infoText_li"> 시장 전화번호 : '+market_arr.callnum+'</div>';
	tempString[6] = '<div class="market_infoText_li"> 시장 다루는 품목 : '+market_arr.dealing+'</div>';
	tempString[7] = '<div class="market_infoText_li"> 시장 대표 품목 : '+market_arr.representative+'</div>';
	tempString[8] = '<div class="market_infoText_li"> 시장 근처 정보 : '+market_arr.nearinfo+'</div>';

	// 시장 img URL 존재 하면 표시
	if (market_arr.imgurl) {
		tempString[9] = '<div class="market_infoText_li"> 시장 이미지 <img src="'+market_arr.imgurl+'"></div>';	
	} else { // 존재 안하면 디폴트 이미지
		tempString[9] = '<div class="market_infoText_li"> 시장 이미지 <img src="/images/market_default.jpg"></div>';
	}
	
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

}

function managerInfoLi_event(market_arr) {

	console.log(market_arr);

	// 태그 동적으로 생성하기
	var tempString = new Array();
	var fullString = '';

	tempString[0] = '<div class="market_infoText_li"> 상점 이름 : '+market_arr.market_name+'</div>';
	tempString[1] = '<div class="market_infoText_li"> 상점 주인 : '+market_arr.manager_name+'</div>';
	tempString[2] = '<div class="market_infoText_li"> 상점 연락처 : '+market_arr.manager_phone+'</div>';
	tempString[3] = '<div class="market_infoText_li"> 상점 위치 : '+market_arr.market_location+'</div>';
	tempString[4] = '<div class="market_infoText_li"> 상점 프로모션 : '+market_arr.market_promotion+'</div>';
	tempString[5] = '<div class="market_infoText_li"> 상점 소개 : '+market_arr.market_introduce+'</div>';
	tempString[6] = '<div class="market_infoText_li"> 소속 시장 : '+market_arr.sijang_name+'</div>';

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

}