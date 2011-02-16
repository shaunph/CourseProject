
  function initialize() {
    var latlng = new google.maps.LatLng(51, -114);
    var myOptions = {
      zoom: 13,
      center: latlng,
      mapTypeControl : false,
      panControl : false,
      scaleControl : false,
      zoomControl : false,
      streetViewControl : false,
      mapTypeId: google.maps.MapTypeId.HYBRID,
    };
    window.gmap = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
  }

