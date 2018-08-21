
// 현우가 건든 부분 ~ 모달창 제어

modal_display.addEventListener('click', function(event) {
  myModal.style.display = "block";
}, false);

modal_close.addEventListener('click', function(event) {
    myModal.style.display = "none";
}, false);

// 언제든지 ESC키 누르면 모달창 닫을수 있게
window.onkeydown = function (event) {
  if(event.keyCode == 27) { 
    myModal.style.display = 'none'; 
  }
};

function deleteNewSearchList() {
  if ($('#search_result > li')) {
    // 동적으로 New 검색 결과 리스트 삭제 
    $('#search_result > li').remove();
  }
}

function makeSearchList(searchResult, listCounter) {

  // 검색 결과 생성전, li 존재하면 정리
  deleteNewSearchList();
  var tempString = new Array();
  var fullString = '\0';
  var half_listCounter = parseInt(listCounter/2); 

  for (var i = 0; i < parseInt(listCounter); i++) {
    // index.js에서 DB 두개 동시에 불러와서 이부분도 수정
    if (searchResult.rows[i].market_name){ // manager DB의 market_name는 pass만
      continue;
    } else {

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
    } // if ~ else : 실제 핵심 구간
  } // for    

  fullString += '</div>'

  // 검색 결과 출력
  $('#search_result').html(fullString);

  // li 태그로 제어 + 이벤트 추가하기
  $('#search_result > li').click(function (event) {
    var temp = $(this).text();
    console.log(temp);
    sijang_name.innerHTML = temp;
    myModal.style.display = 'none';
  }); // click function
} // makerSearchList --> articlr태그 부분

function searchingAjax(event) {

  // search_value 값 공백일때 서버 에러 처리
  if(!search_value.value){
    alert("검색어를 확인하세요!")
    return;
  } 

  // 전달하려는 json 변수
  var params = {
    filed: $('#Searching > select').val(),
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

$("#search_value").keyup(function (event) {
  // Enter 처리
  if (event.keyCode == '13') {
    $("#searchingButton").trigger("click");
  };
});

//──────────────────────addEventListener──────────────────────//

searchingButton.addEventListener('click', searchingAjax, false);