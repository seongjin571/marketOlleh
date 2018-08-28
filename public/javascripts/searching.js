//───────────────────────────── 검색 부분 javascripts ─────────────────────────────//

// FUNCTION

function TableSetting() {
	var test2 = $('.Goomap_inner > span');

	for (var i = 0; i < test2.length; i++) {
		// 동적으로 div~(Goomap table td) 태그에서 gooAjax 클릭 이벤트 추가
		test2[i].addEventListener('click', gooAjax, false);
	}
}

function turningBack() {
	swiper2.destroy();
	swiper2 = new Swiper('.s2', {
		initialSlide: 0,
		autoHeight: true,
		observer: true,
		observeParents: true,
		scrollbar: {
			el: '.swiper-scrollbar',
			hide: true,
		},
	});

	// 스크롤 조절 
	window.scrollTo(0, 0);

	var temp_goo = document.getElementById('NewGoomap');
	var temp_serch = document.getElementById('search_result');

	// 새로운 구(NewGoomap > table) 테이블에 시장정보 있다면
	if (temp_goo.hasChildNodes()) {
		deleteNewGooTable();
		return;
	} else if (document.getElementById('Goomap').style.display == 'block') {
		console.log("Turn back");
		navControl();
		return;
	} // Goomap이 표출된 상태에선 뒤로가기 기능

	// 검색 후 뒤돌아가기 기능
	if (temp_serch.hasChildNodes() && document.getElementById('aaa').style.display == "none") {
		if ($('#market_infoText > div').length > 0) { // 검색후 시장 클릭을 한 상태에서 뒤로가기
			document.getElementById('market_infor').style.display = "none";
			document.getElementById('store_infor').style.display = "none";
			$('#search_result').css('display', 'block');
			document.getElementById('store_infor').style.display = "none";
			setStyle_search_result();
		} else { // 검색만 하고 뒤로가기
			deleteNewSearchList();
			document.getElementById('aaa').style.display = "block";
			$('#navControlButton').css('display', 'table');
			document.getElementById('text_logo').style.display = "block";
			document.getElementById('back_div').style.display = "none";
			document.getElementById('Searching').style.display = "table";
			document.getElementById('market_infor').style.display = "none";
			document.getElementById('store_infor').style.display = "none";	
		} // inner else ~ if
	} else if (!temp_goo.hasChildNodes()) { // store_infor 가 바로 실행될 경우
		document.getElementById('aaa').style.display = "block";
		$('#navControlButton').css('display', 'table');
		document.getElementById('text_logo').style.display = "block";
		document.getElementById('back_div').style.display = "none";
		document.getElementById('Searching').style.display = "table";
		document.getElementById('market_infor').style.display = "none";
		document.getElementById('store_infor').style.display = "none";
		$('#noGood_Button_sj').off();
		$('#yesGood_Button_sj').off();
	} // if ~ else

	$('#market_infoText > div').remove();
}

// TurningBack의 자유로운 사용을 위해 NewGooTable 제어 함수 분할
function deleteNewGooTable() {
	// 동적으로 New Table 삭제 --> 기존 테이블 show
	$('#NewGoomap > div').remove();
	$('#Goomap_container').show();

	// 지도 표출후 다시 original Goomap 으로 가는 상황 고려
	$('#market_infor').hide();
	$('#store_infor').hide();
	
}

function deleteNewSearchList() {
	if ($('#search_result > div > li')) {
		// 동적으로 New 검색 결과 리스트 삭제 
		$('#search_result > div > li').remove();
	}
}

function makeGooTable(tableValue, gooCounter) {

	// 스크롤 조절 
	window.scrollTo(0, 0);

	var tempString = new Array();
	var fullString = '';

	// making NewGoomap ~ div ~ li 태그
	tempString[0] = "<br>";
	for (var i = 1; i <= parseInt(gooCounter); i++) {
		tempString[i] = '<li>' + tableValue.rows[i - 1].name + '</li>'
		if (i % 3 == 0) // 3개 시장마다 줄 바꿈
			tempString[i] += '<br>'
	} // for

	for (var index in tempString) {
		fullString += tempString[index];
	} // for in 

	// 같은 구 클릭했는지 검사
	if ($('#NewGoomap > div')) {
		if ($('#NewGoomap > div').html() == fullString) {
			$('#NewGoomap > div').remove();
			return;
		}
	}

	$('#NewGoomap > div').remove();
	$('#NewGoomap').append("<div></div>");

	// jquery, table값제어 / 동적 생성된 td에 클릭함수추가
	$('#NewGoomap > div').html(fullString);
	$('#NewGoomap > div > li').click(function (event) {
		// Daum(kakao map api test line)
		$('#navControlButton').css('display', 'none');
		$('#Goomap_container').css('display', 'none');
		$('#Goomap').css('height', '0%');
		document.getElementById('market_infor').style.display = "block";

		temp = $(this).text();
		for(var i = 0; i < parseInt(gooCounter); i++){
			if(temp == tableValue.rows[i].name){
				// searching_marketinfo.js 파일 참조하기!!
				marketInfoLi_event(tableValue.rows[i]);
			}
		} // for
	}); // click function

} // makeGooTable

function makeSearchList(searchResult, listCounter) {

	// 스크롤 조절 
	window.scrollTo(0, 0);

	// 검색하면 aaa div 부분 none 하기
	// 검색하면 뒤로가기 버튼 blcok 하기 (turningBack 함수 참조)
	document.getElementById('aaa').style.display = "none";
	document.getElementById('text_logo').style.display = "none";
	$('#navControlButton').css('display', 'none');
	document.getElementById('back_div').style.display = "block";

	// 검색 결과 생성전, li 존재하면 정리
	deleteNewSearchList();
	if (search_result.style.display == "none") {
		search_result.style.display = "block";
	}

	// 변수 선언
	var tempString = new Array();
	var fullString = '\0';
	var isManager = false;
	var half_listCounter = parseInt(listCounter/2)+1;
	if (listCounter <= 2) {
		half_listCounter = 1;
	}

	// 시장, 상점 통합 검색
	for (var i = 0; i < parseInt(listCounter); i++){
		if (searchResult.rows[i].name) { // 시장 API 검색 이면
			
			if (i%half_listCounter == 0) {
				if (i == 0) { // 처음 실행 ~ div 닫기 태그 X
				  tempString[i] = '<div><li>' + searchResult.rows[i].name + '</li>'  
				} else {
				  tempString[i] = '</div><div><li>' + searchResult.rows[i].name + '</li>'
				} // inner if ~ else
			} else {
				tempString[i] = '<li>' + searchResult.rows[i].name + '</li>'       
			}
			fullString += tempString[i];

		} else { // manager DB에서 결과라면

			if (i%half_listCounter == 0) {
				if (i == 0) { // 처음 실행 ~ div 닫기 태그 X
				  tempString[i] = '<div><li>' + searchResult.rows[i].market_name + '</li>'  
				} else {
				  tempString[i] = '</div><div><li>' + searchResult.rows[i].market_name + '</li>'
				} // inner if ~ else
			} else {
				tempString[i] = '<li>' + searchResult.rows[i].market_name + '</li>'       
			}
			fullString += tempString[i];
		}
	}
	fullString += '</div>'

	// 검색 결과 li css 제어 + 이벤트 추가하기
	$('#search_result').html(fullString);
	 setStyle_search_result();

	// 검색 결과 시장 리스트. 클릭 이벤트 - searching_marketinfo.js 필참
	$('#search_result > div > li').click(function (event) {
		window.scrollTo(0, 0); // 스크롤 맨위로 끌올
		$('#search_result').parent().css('display', 'none');
		$('#Searching').css('display', 'none');
		document.getElementById('market_infor').style.display = "block";

		temp = $(this).text();
		// 검색 결과 li 태그도 클릭시 맵 좌표 찍어주기
		for(var i = 0; i < parseInt(listCounter); i++){
			if(temp == searchResult.rows[i].name){ // 시장 API 경우
				marketInfoLi_event(searchResult.rows[i]);
			} else if(temp == searchResult.rows[i].market_name) { // manager DB에서 검색된 결과인 경우
				managerInfoLi_event(searchResult.rows[i]);
			} // if ~ else
		} // for
		searchResult = ''; // 후처리, 겹치는 에러 방지

	}); // click function
} // makerSearchList --> article태그 부분

function gooAjax(event) {
	$('.Goomap_inner>span').css('color','black');
	// ajax 비동기적 통신으로 (index.js ~ url 참조)
	// DB 값 rows json object 몽땅 받아옴
	$.ajax({
		url: '/searching/gooname',
		dataType: 'json',
		type: 'POST',
		data: { "gooname": $(this).text() },
		success: function (result) {
			console.log(result);
			makeGooTable(result, result.rows.length);
		},
		error: function (e) {
			alert("Error!");
			console.log('process error : ', e);
		}
	});

	$(this).parents(".map_div").append($('#NewGoomap'));
	$(this).css('color','#fb83a5')

} // gooAjax

function searchingAjax(event) {

    // search_value 값 공백일때 서버 에러 처리
    if(!search_value.value){
      alert("검색어를 확인하세요!")
      return;
    } 

	// 전달하려는 json 변수
	var params = {
		filed: "name",
		search_value: $('#search_value').val()
	};
	$.ajax({
		url: "/searching/gooname",
		dataType: 'json',
		type: 'POST',
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data: params,
		success: function (result) {
			console.log(result);
			if (result.rows.length > 0) {
				makeSearchList(result, result.rows.length);
			} else {
				alert("검색어를 확인하세요!")
			}
		},
		error: function (e) {
			alert("검색어를 확인하세요!");
			console.log('process error : ', e);
		}
	});
} // searchingAjax

// 지도로 찾기 버튼 이벤트 
function navControl(event) {
	// Goomap / 활성화 되어있을때 if --> 다시 none으로
	if (document.getElementById('Goomap').style.display == "block") {
		document.getElementById('Searching').style.display = "table";
		document.getElementById('Goomap').style.display = "none";
		document.getElementById('aaa').style.display = "block";
		document.getElementById('text_logo').style.display = "block";
		document.getElementById('navControlButton').style.display = "table";
		document.getElementById('back_div').style.display = "none";
		// 스크롤 조절 
		window.scrollTo(0, 0);		
	} else { // Goomap / 비활성화 되어있을때 else --> block
		$('#search_result').parent().css('display', 'none');
		deleteNewSearchList(); // 검색후 navControl 버튼 눌렀을때 고려
		document.getElementById('navControlButton').style.display = "none";
		document.getElementById('Searching').style.display = "none";
		document.getElementById('Goomap').style.display = "block";
		document.getElementById('aaa').style.display = "none";
		document.getElementById('text_logo').style.display = "none";
		document.getElementById('back_div').style.display = "block";
		// 스크롤 조절 
		window.scrollTo(0, 0);	
	}
	deleteNewGooTable();
}

function setStyle_search_result() {
  
  $('#search_result').parent().css('display', 'flex');
  $('#search_result').css('display', 'flex'); 
  $('#search_result').css('list-style', 'none');  

  // flex설정후 word-break
  $('#search_result > div').css('width', '140px');
  $('#search_result > div').css('word-break', 'break-all');
  $('#search_result > div').css('margin-left', '5%');
  $('#search_result > div > li').css('margin-top', '5%');
  
} // setStyle_search_result

//////////////////////addEventListener//////////////////////

// 초기 기본 세팅
TableSetting();
document.getElementById('navControlButton').addEventListener('click', navControl, false);
document.getElementById('back_div').addEventListener('click', turningBack, false);
document.getElementById('searchingButton').addEventListener('click', searchingAjax, false);
$("#search_value").keyup(function (event) {
	// Enter 처리
	if (event.keyCode == '13') {
		$("#searchingButton").trigger("click");
	};
}); // keyup event

