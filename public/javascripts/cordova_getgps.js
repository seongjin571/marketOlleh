
function getMyLocationInS(lng,lat){
    if (!window.myLat) {
        window.myLat = lat;
        window.myLng = lng;
        market_location.value = window.myLat+", "+window.myLng;
    }
    else{
        market_location.value = window.myLat+", "+window.myLng;
    } // if ~ else
    check_getGPS(); // start.ejs 마지막줄 js참조
}

function gpsGetFail() {
    console.log("못받아옴");
    // alert("Can't get GPS!");
    $('.alert_select').css('display', 'block');
    $('.alert_content_select').html(
        'GPS가 꺼져있습니다.</br><span id="no_gps_alert">위치를 받아오는데 시간이 걸릴 수 있습니다.</span></br>'
    );
    $('#no_gps_alert').css('font-size','0.8em');
    $('.alert_select_ok').click(function () {
        window.location = './start';
        gpsNULL();
    });     
}

function gpsNULL(){

    alert("위치권한이 필요합니다.")
    // window.seoulApp.getGPS();
    window.seoulApp.getGPSPermission();
    if (!isGPSPermission) { // false
        // window.seoulApp.reload();
        window.seoulApp.getGPS();
    }

}  

function getPermission(isGPSPermission) {
    window.isGPSPermission = isGPSPermission;
}