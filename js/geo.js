
var map;
var marker;
var infowindow;
var watchID;


// "deviceready" shows phonegap when the web page was completely loaded
$(document).ready(function(){
	// callback onDeviceReady()
    document.addEventListener("deviceready", onDeviceReady, false);
});
 
function onDeviceReady() {
    $(window).unbind();
    
    $(window).bind('pageshow resize orientationchange', function(e){
        max_height();
    });
    
    max_height();
    google.load("maps", "3.8", {"callback": map, other_params: "sensor=true&language=en"});
}
 
function max_height(){
    var h = $('div[data-role="header"]').outerHeight(true);
    var f = $('div[data-role="footer"]').outerHeight(true);
    var w = $(window).height();
    var c = $('div[data-role="content"]');
    var c_h = c.height();
    var c_oh = c.outerHeight(true);
    var c_new = w - h - f - c_oh + c_h;
    var total = h + f + c_oh;
    
    if(c_h<c.get(0).scrollHeight){
        c.height(c.get(0).scrollHeight);
    }else{
        c.height(c_new);
    }
}

// Initial map drawing ( no location found yet )
function map(){
	// Setting the center of the map in the center of Romania
    var latlng = new google.maps.LatLng(46, 25);
    
    var myOptions = {
      zoom: 6,
      center: latlng,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true
    };
    
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    
    
    // Starting the map watch ( watches your position )
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        watchID = navigator.geolocation.watchPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true });   
    }); 
}


// Pretty obvious Vlad, you're an idiot.
function geo_error(error){
    //comment
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}


function geo_success(position) {
	
	// You can also set map options like this, you don't need to redraw the map
    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    map.setZoom(15);
 
    var info = 
    ('Latitude: '         + position.coords.latitude          + '<br>' +
    'Longitude: '         + position.coords.longitude         + '<br>' +
    'Altitude: '          + position.coords.altitude          + '<br>' +
    'Accuracy: '          + position.coords.accuracy          + '<br>' +
    'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br>' +
    'Heading: '           + position.coords.heading           + '<br>' +
    'Speed: '             + position.coords.speed             + '<br>' +
    'Timestamp: '         + new Date(position.timestamp));
 
 	// The point variable changes everytime the user updates it's position.
    var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	// If there is no marker, create it with the first set of LAT LNG data, else, just move it to the
	// new set of data.
    if(!marker){
        marker = new google.maps.Marker({ position: point, map: map });
    }else{
        marker.setPosition(point);
    }
 
 	// The same as the marker, just with an infobox that updates its content.
    if(!infowindow){
        infowindow = new google.maps.InfoWindow({ content: info });
    }else{ 
    	infowindow.setContent(info);
    }
    
    // If the marker is clicked ( or touched, whatever ) open the infobox.
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    }); 
}