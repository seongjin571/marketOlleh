// 지도를 표시할 div (id)
var mapContainer = document.getElementById('map'), 
    mapOption = { 
        center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 4 // 지도의 확대 레벨
    };

var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도를 클릭했을때 클릭한 위치에 마커를 추가하도록 지도에 클릭이벤트를 등록합니다
daum.maps.event.addListener(map, 'click', function(mouseEvent) {
    var latlng = mouseEvent.latLng; 
    // 클릭한 위치에 마커를 표시합니다 
    addMarker(latlng);

    var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고,  '+'경도는 ' + latlng.getLng() + ' 입니다';
	var resultDiv = document.getElementById('clickLatlng');
	resultDiv.innerHTML = message;       
}); // PS. latLng를 DB로부터 받아서 for문과 DB 데이터 교환을 통해 addMarker 함수 호출해서 모든 시장의 마크 찍을 수 있을 듯

// 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var markers = [];

// 마커 하나를 지도위에 표시합니다 
addMarker(new daum.maps.LatLng(33.450701, 126.570667));

// 마커를 생성하고 지도위에 표시하는 함수입니다
function addMarker(position) {
    
    // 마커를 생성합니다
    var marker = new daum.maps.Marker({
        position: position
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
    console.log(marker.position)
    
    // 생성된 마커를 배열에 추가합니다
    markers.push(marker);
}

// 배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
function setMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }            
}

// "마커 보이기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에 표시하는 함수입니다
function showMarkers() {
    setMarkers(map)    
}

// "마커 감추기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에서 삭제하는 함수입니다
function hideMarkers() {
    setMarkers(null);    
}

// 
function changeCenter(){
	var moveLatLon = new daum.maps.LatLng(Umaplat.value, Umaplng.value);

	// 지도 중심을 이동 시킵니다
	map.setCenter(moveLatLon);
	map.setLevel(2);
}