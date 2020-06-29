let autocomplete, geometry, lat, lng, address_components, formatted_address;
let address_obj ={};
const anchor_array = ['superfundanchor','cleanupanchor','earthquakeanchor','crimeanchor','megansanchor','whitepagesanchor','googleanchor']


//preparation functions
let addresscomponents_obj = function() {
       address_obj ={};
      for (item of address_components) {
       if (!address_obj[item["types"][0]]) {
           address_obj[item["types"][0]] = item["short_name"]
       } 
      } 
    
}

function updateLink(classname,newlink) {
    document.getElementsByClassName(classname)[0].href =newlink;
    document.getElementsByClassName(classname)[1].href =newlink;
}

//If the user uses autocomplete
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('search_input')), {
	types: ['geocode']
});

google.maps.event.addListener(autocomplete, 'place_changed', function () {
    assignment(autocomplete.getPlace());
    showlist();
})

//if the user hard inputs address
let geocoder;
function submit() {
    geocoder = new google.maps.Geocoder();
	let input = document.getElementById('search_input').value;
    geocoder.geocode( { 'address': input}, function(results, status) {
      if (status == 'OK') {
    assignment(results[0]);
    showlist();
      } else {
        document.getElementById('modalBody').innerHTML=`Opps! No details available for input:${input}`; $('#exampleModal').modal('show');
        return;
      }
    });
    
}
//functions used both for autocomplete and hard input
function assignment(place) {
    geometry = place.geometry;
	lat = place.geometry.location.lat();
	lng = place.geometry.location.lng();
    address_components = place.address_components;
    formatted_address = place.formatted_address;
    addresscomponents_obj();    
}
function showlist() {
    document.getElementById('form-group').style.marginTop="10px";
    let list = document.getElementById('list');
    $(list).show( "slow" );
	initMap();
    addresscomponents_obj();
   $('.address').html(formatted_address.split(',')[0]); anchor_array.forEach(item=>updateLink(item,eval(`${item}()`))); 
    $("html, body").animate({ scrollTop: 0 }, 350); 
    window.onscroll = function() {stickySearch()};  

}


//display map & stree view
var map;
var panorama;

function initMap() {
	var theplace = {
		lat: lat,
		lng: lng
	};
    var sv = new google.maps.StreetViewService();
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));


	// Set up the map.
        map = new google.maps.Map(document.getElementById('map'), {
          center: theplace,
          zoom: 15,
          streetViewControl: false
        });
    // Set the initial Street View camera to the center of the map
        sv.getPanorama({location: theplace, radius: 50}, processSVData);
    
        map.addListener('click', function(event) {
          sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
        });
      }
    
function processSVData(data, status) {
        if (status === 'OK') {
          var marker = new google.maps.Marker({
            position: data.location.latLng,
            map: map,
            title: data.location.description
          });

          panorama.setPano(data.location.pano);
          panorama.setPov({
            heading: 270,
            pitch: 0
          });
          panorama.setVisible(true);

          marker.addListener('click', function() {
            var markerPanoID = data.location.pano;
            // Set the Pano to use the passed panoID.
            panorama.setPano(markerPanoID);
            panorama.setPov({
              heading: 270,
              pitch: 0
            });
            panorama.setVisible(true);
          });
        } else {
         document.getElementById('modalBody').innerHTML=`Opps! Street View data not found for this location, but you can still check other information.`;
        $('#exampleModal').modal('show');
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

//Add scrollbar to the search box
let searchbox = document.getElementById("sticky-search");
let searchbar = document.getElementById("input-box");
let searchbutton = document.getElementById("button-box");

function stickySearch() {
//    console.log(searchbox.offsetTop);
  if (window.pageYOffset >= 176) {
    searchbox.classList.add("sticky");
    searchbar.classList.add("leftfloat-search");
    searchbutton.classList.add("leftfloat-button");
  document.getElementById("search_input").style.borderRadius="0rem";
  } else {
    searchbox.classList.remove("sticky");
    searchbar.classList.remove("leftfloat-search");
    searchbutton.classList.remove("leftfloat-button");
   document.getElementById("search_input").style.borderRadius=".25rem";
  }
}

//read more
function readMore() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("readmorebtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more"; 
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less"; 
    moreText.style.display = "inline";
  }
}
















