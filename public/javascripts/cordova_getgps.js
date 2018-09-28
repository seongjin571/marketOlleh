
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
    // alert("Can't get GPS!");
    $('.alert_gps').css('display', 'block');
    
    $('.alert_content_select_gps').html(
        'GPS가 꺼져있거나 건물내/지하에서 GPS가 잘 작동하지 않을 수 있습니다.'
    );
    // $('#gps_label').css('line-height','8px')
    $('.alert_select_ok_gps').click(function () {
        window.location.reload();
        // window.seoulApp.SignUpgetGPS();
        gpsNULL();
    });
}

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
