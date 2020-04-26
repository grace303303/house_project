var autocomplete, geometry, lat, lng, address_components, formatted_address;

autocomplete = new google.maps.places.Autocomplete((document.getElementById('search_input')), {
	types: ['geocode']
});

google.maps.event.addListener(autocomplete, 'place_changed', function () {
	var place = autocomplete.getPlace();
	lat = place.geometry.location.lat();
	lng = place.geometry.location.lng();
    address_components = place.address_components;
    formatted_address = place.formatted_address;
	geometry = place.geometry;
})

function displaylist() {
	var input = document.getElementById('search_input').value;
	if (!geometry) {
		window.alert("No details available for input: '" + input + "'");
		return;
	} else {
		initMap();
        updateLink('superfund_anchor',superfund());
        updateLink('cleanup_anchor',cleanup());
        updateLink('earthquake_anchor',earthquake());
        updateLink('crime-anchor',crime());
        updateLink('megans-anchor',megans());
        updateLink('whitepages-anchor',whitepages());
        updateLink('google-anchor',googlesearch());
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

//Superfund map
function superfund() {
    let link = 'https://epa.maps.arcgis.com/apps/webappviewer/index.html?id=33cebcdfdd1b4c3a8b51d416956c41f1&extent=';
    link = link + (lng-0.01) + ',' + (lat-0.01) + ',' + (lng+0.01) +  ',' + (lat+0.01);
    return link;  
}
//Cleanup map
function cleanup() {
    let link = 'https://geotracker.waterboards.ca.gov/map/?CMD=runreport&myaddress=';
    link = link + document.getElementById('search_input').value;
    return link;

}
//Earthquake map
function earthquake() {
    let link = 'https://maps.conservation.ca.gov/cgs/EQZApp/app/?extent=';
    link = link + (lng-0.1) + ',' + (lat-0.1) + ',' + (lng+0.1) +  ',' + (lat+0.1);
    return link;
}
//Crime map
function crime() {
    let link = 'https://www.neighborhoodscout.com/ca/'
    for (item of address_components) {
        let city;
        if (item["types"][0]==="locality") {
            city=item["long_name"].replace(" ","-"); 
            link = link + city + '/crime';
        }   
    }
    return link;
}
//Megan's Law
function megans() {
    let link = 'https://www.meganslaw.ca.gov/Disclaimer.aspx?m=q&a=';
    link = link + formatted_address + '&r=2';
    return link; 
}

//Whitepages
function whitepages() {
    let link = 'https://www.whitepages.com/address/';
    let addedlink = '';
    let addedlink2;
    let address_array = formatted_address.split(', ');
    for (let i=address_array.length-2; i>=0; i--) {
        if (i===address_array.length-2) {
            addedlink = '-' + address_array[i].substring(0,2) + addedlink;
        }
        else if (i===address_array.length-3) {
            addedlink = '/' + address_array[i] + addedlink;
        } else {
            addedlink = address_array[i] + addedlink;
        }    
    }
    addedlink2 = link+ addedlink.replace(new RegExp(' ', "g"), '-')
    return addedlink2;

}

//Google Search
function googlesearch() {
    let link = 'https://www.google.com/search?q=' + formatted_address;
    return link;
}

function updateLink(id,newlink) {
    document.getElementById(id).href = newlink;
}





















