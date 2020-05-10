let autocomplete, geometry, lat, lng, address_components, formatted_address;
let address_obj ={};
const anchor_array = ['superfundanchor','cleanupanchor','earthquakeanchor','crimeanchor','megansanchor','whitepagesanchor','googleanchor']


autocomplete = new google.maps.places.Autocomplete((document.getElementById('search_input')), {
	types: ['geocode']
});

google.maps.event.addListener(autocomplete, 'place_changed', function () {
	var place = autocomplete.getPlace();
    geometry = place.geometry;
	lat = place.geometry.location.lat();
	lng = place.geometry.location.lng();
    address_components = place.address_components;
    formatted_address = place.formatted_address;
    addresscomponents_obj();	
})

//preparation functions
let addresscomponents_obj = function() {
       address_obj ={};
      for (item of address_components) {
       if (!address_obj[item["types"][0]]) {
           address_obj[item["types"][0]] = item["short_name"]
       } 
      }     
}

function updateLink(id,newlink) {
    document.getElementById(id).href = newlink; 
}

function displaylist() {
	var input = document.getElementById('search_input').value;
	if (!geometry) {
		window.alert("No details available for input: '" + input + "'");
		return;
	} else {
		initMap();
        addresscomponents_obj();
        anchor_array.forEach(item=>updateLink(item,eval(`${item}()`)));     
	}
}

//display map & stree view
var panorama;

function initMap() {
	var theplace = {
		lat: lat,
		lng: lng
	};

	var map = new google.maps.Map(document.getElementById('map'), {
		center: theplace,
		zoom: 15,
		streetViewControl: false
	});
    var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
});
marker.setPosition(geometry.location);
marker.setVisible(true);

	panorama = map.getStreetView();
	panorama.setPosition(theplace);
	panorama.setPov( /** @type {google.maps.StreetViewPov} */ ({
		heading: 265,
		pitch: 0
	}));
}

function toggleStreetView() {
	var toggle = panorama.getVisible();
	if (toggle == false) {
		panorama.setVisible(true);
		document.getElementById('togglestreet').value = "View Map";
	} else {
		panorama.setVisible(false);
		document.getElementById('togglestreet').value = "Street View";
	}
}

//get different updated anchor links
let superfundanchor = function() {
    return `https://epa.maps.arcgis.com/apps/webappviewer/index.html?id=33cebcdfdd1b4c3a8b51d416956c41f1&extent=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}`; 
}

let cleanupanchor = function() {
return `https://geotracker.waterboards.ca.gov/map/?CMD=runreport&myaddress=${formatted_address}`;
}

let earthquakeanchor = function() {
    return `https://maps.conservation.ca.gov/cgs/EQZApp/app/?extent=${lng-0.03},${lat-0.03},${lng+0.03},${lat+0.03}`;
}

let crimeanchor = function() {
    return `https://www.neighborhoodscout.com/${address_obj['administrative_area_level_1']?address_obj['administrative_area_level_1'].toLowerCase():''}/${ address_obj["locality"].replace(' ','-')}/crime`;
}

let megansanchor = function() {
    return `https://www.meganslaw.ca.gov/Disclaimer.aspx?m=q&a=${formatted_address}&r=2`;
}

function whitepagesanchor() {
    return `https://www.whitepages.com/address/${address_obj['street_number']?address_obj['street_number']+'-':''}${address_obj['route']?address_obj['route'].replace(' ','-')+'/':''}${address_obj['locality']?address_obj['locality'].replace(' ','-')+'-':''}${address_obj['administrative_area_level_1']?address_obj['administrative_area_level_1']:''}`
}

let googleanchor = function() {
    return `https://www.google.com/search?q=${formatted_address}+-mls+-"square+foot"+-redfin+-trulia+-zillow+-prices+-"real estate agent"`;
}























