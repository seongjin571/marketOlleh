//───────────────────────────── 검색 부분 javascripts ─────────────────────────────//


// FUNCTION
// 기본적인 함수 흐름 TableSetting -> gooAjax ~ makeGooTable (hideGooTable)
// --> 

function TableSetting() {
	document.getElementById('KakaoMap').style.display = "none";
	var test2 = document.getElementsByTagName('td');

	for(var i=0; i<test2.length; i++){
		// 동적으로 div~(Goomap table td) 태그에서 gooAjax 클릭 이벤트 추가
		test2[i].addEventListener('click', gooAjax, false);
	}
}

function hideGooTabe() {
	// 기존 테이블 숨기고 동적으로 New Table
	$('#Goomap > table').hide();
	$('#NewGoomap').append("<table></table>");
	$('#NewGoomap > table').append("<tbody></tbody>")
}

function deleteNewGooTabe() {
	// 동적으로 New Table 삭제 --> 기존 테이블 show
	$('#NewGoomap > table').remove();
	$('#Goomap > table').show();
}

function deleteNewSearchList() {
	if ($('#search_result > li')) {
		// 동적으로 New 검색 결과 리스트 삭제 
		$('#search_result > li').remove();		
	}
}

function makeGooTable(tableValue, gooCounter) {

	hideGooTabe();
	var tempString = new Array();
	console.log(tableValue.rows[0].name);
	var fullString = '\0';

	// making table 한줄에 5개 예시
	tempString[0] = '<tr>'
	for (var i = 1; i <= parseInt(gooCounter); i++) {
		tempString[i] += '<td>'+tableValue.rows[i-1].name+'</td>'
		if (i%5==0) // 5개 시장마다 줄 바꿈
			tempString[i] += '</tr><tr>'
	} // for

	for (var index in tempString) {
		fullString += tempString[index];
	} // for in 

	// jquery, table값제어 / 동적 생성된 td에 클릭함수추가
	$('#NewGoomap > table > tbody').html(fullString);
	$('#NewGoomap > table > tbody > tr > td').click(function(event) {
		// Daum(kakao map api test line)
		var temp = document.getElementById('KakaoMap').style.display;
		if (temp == "block") {
			document.getElementById('KakaoMap').style.display = "none";
		}else {
			document.getElementById('KakaoMap').style.display = "block";
		}

		temp = $(this).text();
		for(var i = 0; i < parseInt(gooCounter); i++){
			if(temp == tableValue.rows[i].name){
				console.log(tableValue.rows[i].coordinateX, tableValue.rows[i].coordinateY);
				changeCenter(tableValue.rows[i].coordinateX, tableValue.rows[i].coordinateX);
			}
			else
				console.log('false');
		}
	// this의 text 시장 이름 값에 맞는 '좌표 가져와서 map API로 연결해주기'	
	// 여기서도 ajax로 DB참조해 시장 이름에 맞는 좌표 가져와서 그 결과를
	// 기반으로 changeCenter() 함수 실행하기

	}); // click function
} // makeGooTable

function makeSearchList(searchResult, listCounter) {
	
	deleteNewSearchList();
	console.log(searchResult.rows[0].name, listCounter);
	var tempString = new Array();
	var fullString = '\0';

	for (var i = 0; i < parseInt(listCounter); i++){
		tempString[i] = '<li>'+searchResult.rows[i].name+'</li>'
		fullString += tempString[i];
	} // for

	$('#search_result').html(fullString);
	$('#search_result > li').click(function(event) {
		alert("click FUNCTION test");
	});
} // makerSearchList --> ol태그 부분

function gooAjax(event){
	// ajax 비동기적 통신으로 (index.js ~ url 참조)
	// DB 값 rows json object 몽땅 받아옴
	$.ajax({		
		url:'/searching/gooname',
		dataType: 'json',
		type:'POST',
		data: {"gooname":$(this).text()},
		success: function(result) {
			console.log('process sucess');
			console.log(result);
			// 비동기식 함수 실행 순서로 여기에다 함수 호출함
			makeGooTable(result, result.rows.length); 
		},
		error: function(e) {
			alert("Error!");
			console.log('process error : ', e);
		}
	});
} // gooAjax

function searchingAjax(event) {
	// 전달하려는 json 변수
	var params = {
		filed: $('select').val(),
		search_value: $('#search_value').val()
	};
	$.ajax({
		url:"/searching/gooname",
		dataType:'json',
		type:'POST',
		contentType:'application/x-www-form-urlencoded; charset=UTF-8',
		data: params,
		success: function(result) {
			console.log('form data ajax clear!')
			console.log(result);
			// 비동기식, 함수호출
			makeSearchList(result, result.rows.length);
		},
		error: function(e) {
			alert("Error!");
			console.log('process error : ', e);
		}
	});
} // searchingAjax

function navControl(event){
	var booleanB = Boolean(Searching.hidden);
	Searching.hidden = !booleanB;
	Goomap.hidden = booleanB;
}


//////////////////////addEventListener//////////////////////

TableSetting();
navControl();
document.getElementById('navControlButton').addEventListener('click', navControl, false);
document.getElementById('tableControl').addEventListener('click', deleteNewGooTabe, false);
document.getElementById('searchingButton').addEventListener('click', searchingAjax, false);
$("#search_value").keyup(function(event) {
  // Enter 처리
  if (event.keyCode == '13') {
    $("#searchingButton").trigger("click");
  };
});
////////////////////KAKAO MAP API SECTIOn////////////////////
