function NewGoomapLi_event(market_arr) {

	console.log(market_arr)


	var tempString = new Array();
	var fullString = '';

	tempString[0] = '<div class="market_infoText_li">'+market_arr.coordinateY+', '+market_arr.coordinateX+'</div>';
	tempString[1] = '<div class="market_infoText_li"> 시장 이름 : '+market_arr.name+'</div>';
	tempString[2] = '<div class="market_infoText_li"> '+market_arr.shape+'</div>';
	tempString[2+1] = '<div class="market_infoText_li"> <a href='+market_arr.web+'>시장 링크</a></div>';
	tempString[3+1] = '<div class="market_infoText_li"> 시장 지번 : '+market_arr.oldaddress+'</div>';
	tempString[4+1] = '<div class="market_infoText_li"> 시장 전화번호 : '+market_arr.callnum+'</div>';
	tempString[5+1] = '<div class="market_infoText_li"> 시장 다루는 품목 : '+market_arr.dealing+'</div>';
	tempString[6+1] = '<div class="market_infoText_li"> 시장 대표 품목 : '+market_arr.representative+'</div>';
	tempString[7+1] = '<div class="market_infoText_li"> 시장 근처 정보 : '+market_arr.nearinfo+'</div>';
	tempString[8+1] = '<div class="market_infoText_li"> 시장 이미지 <img src="http://economy.seoul.go.kr/files/2012/07/500cb3c3f2c614.88720972.jpg"></div>';

	for (var index in tempString) {
		fullString += tempString[index];
	} // for in 


	market_infoText.innerHTML = fullString;
	changeCenter(market_arr.coordinateY, market_arr.coordinateX);
	NewGoomapLi_css();

}

// 
function NewGoomapLi_css() {
	$(".market_infoText_li").css('margin', '10px');
	$(".market_infoText_li > img").css('width', '100%');
}