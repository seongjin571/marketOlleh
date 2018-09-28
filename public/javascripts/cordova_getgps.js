
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
    $('.alert_select').css('display', 'block');
    
    $('.alert_content_select').html(
        '<label id="gps_label">GPS가 꺼져있습니다</br>위치를 받아오는데 시간이 걸릴 수 있습니다</label>'
    );
    $('#gps_label').css('line-height','20px')
    $('.alert_select_ok').click(function () {
        window.location.reload();
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
