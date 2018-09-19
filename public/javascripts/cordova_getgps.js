
function getMyLocationInS(lng,lat){
    if (!window.myLat) {
        window.myLat = lat;
        window.myLng = lng;
        market_location.value = window.myLat+", "+window.myLng;    
    }
    else{
        market_location.value = window.myLat+", "+window.myLng;
    }
}

function gpsGetFail() {
    console.log("못받아옴");
    alert("Can't get GPS!")
    window.location = './start';
}

function gpsNULL(){
    alert("위치권한이 필요합니다.")
    window.seoulApp.getGPS();
    window.seoulApp.getGPSPermission();
    if (!isGPSPermission) { // false
        // window.seoulApp.reload();
        window.seoulApp.getGPS();
    }
}  

function getPermission(isGPSPermission) {
    window.isGPSPermission = isGPSPermission;
}