
function getMyLocationInS(lng,lat){

        window.myLat = lat;
        window.myLng = lng;
        market_location.value = window.myLat+", "+window.myLng;
  
        var setPo = new daum.maps.LatLng(myLat, myLng);
        changeCenter(setPo);
        marker.setPosition(setPo);
} // getMyLocationInS()


function gpsGetFail() {
    var test = window.location.pathname;
    if (test == "/start") {
        // reload 필요 X
        $('.alert_gps').css('display', 'block');
        $('.alert_content_select_gps').html(
            'GPS 인식에 실패하였습니다. GPS를 켜고 만약 건물내부 일시 위치 설정을 높은 정확도로 변경해주세요'
        );        
    }
    else {
        // 다른 페이지에선 reload가 필요
        $('.alert_gps').css('display', 'block');
        $('.alert_content_select_gps').html(
            'GPS 인식에 실패하였습니다. GPS를 켜고 만약 건물내부 일시 위치 설정을 높은 정확도로 변경해주세요'
        );
        // $('#gps_label').css('line-height','8px')
        $('.alert_select_ok_gps').click(function () {
            window.location.reload();
            gpsNULL();
        });
    }
} // gpsGetFail() ~ loaction.ejs에서는 엑션 제외 


function gpsNULL(){

    // window.seoulApp.getGPS();
    window.seoulApp.getGPSPermission();
    if (!isGPSPermission) { // false
        alert("위치권한이 필요합니다.");
        // window.seoulApp.reload();
        window.seoulApp.getGPS();
    }

}

function getPermission(isGPSPermission) {
    window.isGPSPermission = isGPSPermission;
}
