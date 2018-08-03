//───────────────────────────── 검색 부분 javascripts ─────────────────────────────//

// display 초기 설정 부분 --> main.css 로 이동함
// document.getElementById('tableControl').style.display = "none";
// document.getElementById('Searching').style.display = "block";
// document.getElementById('Goomap').style.display = "none";
// document.getElementById('aaa').style.display = "block";
// document.getElementById('KakaoMap').style.display = "none";

// FUNCTION

function TableSetting() {
	var test2 = $('#Goomap > div > span');

	for (var i = 0; i < test2.length; i++) {
		// 동적으로 div~(Goomap table td) 태그에서 gooAjax 클릭 이벤트 추가
		test2[i].addEventListener('click', gooAjax, false);
	}
}

function hideGooTabe() {
	// 기존 테이블 숨기고 동적으로 New Table
	// $('#Goomap > table').hide();
	$('#NewGoomap').append("<div></div>");
}

// ◀ 버튼의 함수 _ #tableControl
// Goomap, NewGoomap, search_result, navControl() interact!
function turningBack() {

	var temp_goo = document.getElementById('NewGoomap');
	var temp_serch = document.getElementById('search_result');

	// 새로운 구(NewGoomap > table) 테이블에 시장정보 있다면
	if (temp_goo.hasChildNodes()) {
		deleteNewGooTable();
		// document.getElementById('aaa').style.display = "none";
	} else if (document.getElementById('Goomap').style.display == 'block') {
		console.log("Turn back");
		navControl();
	} // Goomap이 표출된 상태에선 뒤로가기 기능

	// 검색 후 뒤돌아가기 기능
	if (temp_serch.hasChildNodes() && document.getElementById('aaa').style.display == "none") {
		deleteNewSearchList();
		document.getElementById('aaa').style.display = "block";
		$('#navControlButton').css('display', 'table');
		document.getElementById('text_logo').style.display = "block";
		document.getElementById('back_div').style.display = "none";
		document.getElementById('Searching').style.display = "table";
		$('article').css('display', 'block');
		document.getElementById('market_infor').style.display = "none";
	}

}

// TurningBack의 자유로운 사용을 위해 NewGooTable 제어 함수 분할
function deleteNewGooTable() {
	// 동적으로 New Table 삭제 --> 기존 테이블 show
	$('#NewGoomap > div').remove();
	$('#Goomap > div').show();

	// 지도 표출후 다시 original Goomap 으로 가는 상황 고려
	$('#market_infor').hide();
}

function deleteNewSearchList() {
	if ($('#search_result > li')) {
		// 동적으로 New 검색 결과 리스트 삭제 
		$('#search_result > li').remove();
	}
}

function makeGooTable(tableValue, gooCounter) {

	// 다른 구 클릭 하고 뒤로가기 안하고 또 다른 구 누를때 고려
	$('#NewGoomap > div').remove();
	hideGooTabe(); // Goomap ~ table 부분 숨기기
	var tempString = new Array();
	console.log(tableValue.rows[0].name);
	var fullString = '\0';

	// making table 한줄에 5개 예시
	tempString[0] = "<br>";
	for (var i = 1; i <= parseInt(gooCounter); i++) {
		tempString[i] = '<li>' + tableValue.rows[i - 1].name + '</li>'
		if (i % 3 == 0) // 5개 시장마다 줄 바꿈
			tempString[i] += '<br>'
	} // for

	for (var index in tempString) {
		fullString += tempString[index];
	} // for in 

	// jquery, table값제어 / 동적 생성된 td에 클릭함수추가
	$('#NewGoomap > div').html(fullString);
	$('#NewGoomap > div > li').click(function (event) {
		// Daum(kakao map api test line)
		$('#navControlButton').css('display', 'none');
		$('#Goomap > div').css('display', 'none');
		$('#Goomap').css('height', '0%');

		var temp = document.getElementById('market_infor').style.display;
		if (temp == "block") {
			document.getElementById('market_infor').style.display = "none";
		} else {
			document.getElementById('market_infor').style.display = "block";
		}

		temp = $(this).text();
		for(var i = 0; i < parseInt(gooCounter); i++){
			if(temp == tableValue.rows[i].name){
				console.log(tableValue.rows[i].coordinateY, tableValue.rows[i].coordinateX);
				changeCenter(tableValue.rows[i].coordinateY, tableValue.rows[i].coordinateX);
			}
		} // for
	}); // click function

} // makeGooTable

function makeSearchList(searchResult, listCounter) {

	// 검색하면 aaa div 부분 none 하기
	// 검색하면 뒤로가기 버튼 blcok 하기 (turningBack 함수 참조)
	document.getElementById('aaa').style.display = "none";
	document.getElementById('text_logo').style.display = "none";
	$('#navControlButton').css('display', 'none');
	document.getElementById('back_div').style.display = "block";

	// 검색 결과 생성전, li 존재하면 정리
	deleteNewSearchList();
	var tempString = new Array();
	var fullString = '\0';
	var isManager = false;

	// 시장, 상점 통합 검색
	for (var i = 0; i < parseInt(listCounter); i++){
		if (searchResult.rows[i].name) { // 시장 API 검색 이면
			tempString[i] = '<li>' + searchResult.rows[i].name + '</li>'
			fullString += tempString[i];
		} else { // manager DB에서 결과라면
			tempString[i] = '<li>' + searchResult.rows[i].market_name + '</li>'
			fullString += tempString[i];
		}
	}

	// if (searchResult.rows[0].name) { // 시장 이름 검색
	// 	for (var i = 0; i < parseInt(listCounter); i++) {
	// 		tempString[i] = '<li>' + searchResult.rows[i].name + '</li>'
	// 		fullString += tempString[i];
	// 	} // for		
	// } else if (searchResult.rows[0].market_name) { // 상점 이름 검색
	// 	for (var i = 0; i < parseInt(listCounter); i++) {
	// 		tempString[i] = '<li>' + searchResult.rows[i].market_name + '</li>'
	// 		fullString += tempString[i];
	// 	} // for
	// }

	// 검색 결과 li 태그로 제어 + 이벤트 추가하기
	$('#search_result').html(fullString);
	$('#search_result > li').click(function (event) {
		// $('#store_infor').css('display', 'block');
		$('article').css('display', 'none');
		$('#Searching').css('display', 'none');
		document.getElementById('market_infor').style.display = "block";

		temp = $(this).text();
		// 검색 결과 li 태그도 클릭시 맵 좌표 찍어주기
		for(var i = 0; i < parseInt(listCounter); i++){
			if(temp == searchResult.rows[i].name){
				console.log(temp);
				console.log(searchResult.rows[i].coordinateY, searchResult.rows[i].coordinateX);
				changeCenter(searchResult.rows[i].coordinateY, searchResult.rows[i].coordinateX);
			} // if
		} // for

	}); // click function
} // makerSearchList --> articlr태그 부분

function gooAjax(event) {
	// ajax 비동기적 통신으로 (index.js ~ url 참조)
	// DB 값 rows json object 몽땅 받아옴
	$.ajax({
		url: '/searching/gooname',
		dataType: 'json',
		type: 'POST',
		data: { "gooname": $(this).text() },
		success: function (result) {
			console.log('process sucess');
			console.log(result);
			// 비동기식 함수 실행 순서로 여기에다 함수 호출함
			makeGooTable(result, result.rows.length);
		},
		error: function (e) {
			alert("Error!");
			console.log('process error : ', e);
		}
	});

	$(this).append($('#NewGoomap'));
} // gooAjax

function searchingAjax(event) {

	// 전달하려는 json 변수
	var params = {
		// filed: $('select').val(),
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
			console.log('form data ajax clear!')
			console.log(result);
			// 비동기식, 함수호출
			if (result.rows.length > 0) {
				makeSearchList(result, result.rows.length);
			} else {
				alert("검색어를 확인하세요!")
			}
		},
		error: function (e) {
			alert("Error!");
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
	} else { // Goomap / 비활성화 되어있을때 else --> block
		deleteNewSearchList(); // 검색후 navControl 버튼 눌렀을때 고려
		document.getElementById('navControlButton').style.display = "none";
		document.getElementById('Searching').style.display = "none";
		document.getElementById('Goomap').style.display = "block";
		document.getElementById('aaa').style.display = "none";
		document.getElementById('text_logo').style.display = "none";
		document.getElementById('back_div').style.display = "block";
	}
	deleteNewGooTable();
}


//////////////////////addEventListener//////////////////////

TableSetting();
document.getElementById('navControlButton').addEventListener('click', navControl, false);
document.getElementById('back_div').addEventListener('click', turningBack, false);
document.getElementById('searchingButton').addEventListener('click', searchingAjax, false);
$("#search_value").keyup(function (event) {
	// Enter 처리
	if (event.keyCode == '13') {
		$("#searchingButton").trigger("click");
	};
});

////////////////////KAKAO MAP API SECTIOn////////////////////
