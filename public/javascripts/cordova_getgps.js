
function getMyLocationInS(lng,lat){

        window.myLat = lat;
        window.myLng = lng;
        market_location.value = window.myLat+", "+window.myLng;
  
        var setPo = new daum.maps.LatLng(myLat, myLng);
        changeCenter(setPo);
        marker.setPosition(setPo);
} // getMyLocationInS()


function gpsGetFail() {
    console.log("못받아옴");
    var test = window.location.pathname;
    if (test == "/start") {
        // reload 필요 X
        $('.alert_gps').css('display', 'block');
        $('.alert_content_select_gps').html(
            'GPS 신호가 잡히지 않습니다. 건물내/지하에서 GPS가 잘 작동하지 않을 수 있습니다. 다시한번 눌러주세요'
        );        
    }
    else {
        // 다른 페이지에선 reload가 필요
        $('.alert_gps').css('display', 'block');
        $('.alert_content_select_gps').html(
            'GPS가 꺼져있습니다 위치를 받아오는데 시간이 걸리거나 건물내/지하에서 GPS가 잘 작동하지 않을 수 있습니다.'
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
