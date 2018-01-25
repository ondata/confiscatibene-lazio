var apiKey = "pk.eyJ1IjoibmVsc29ubWF1IiwiYSI6ImNqNnhhNXFrMzFyZTEyeGxwcmd2Z2J2dHQifQ.vIgELGdEcZ6EMTDKIXcWMg";
L.mapbox.accessToken = apiKey;

var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([41.95, 12.8], 9);

// carico i dati e li memorizzo all'interno di una variabile
// dati da https://docs.google.com/spreadsheets/d/11Ovpz1hQazDSolLE8mZkYx4FezW-1ZMNnnSJ-JPB1QY/edit#gid=429982970
var gsheetSource = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYHT-uy1qLNos8CURf2ql673P9pUQhR3ddymdircsAZ70vjNq2C5-aMU9U3n9U4nrXuwGk1e7F2tjT/pub?gid=570046238&single=true&output=csv';

// tramite la funzione omnivore, faccio il parsing dei dati e aggiungo il layer sulla mappa
var cbData = omnivore.csv(gsheetSource, null, L.mapbox.featureLayer()).addTo(map);
console.log();

// aggiungo di sfondo il perimetro amministrativo del lazio
$.ajax({
    url: 'js/lazio.geojson',
    dataType: 'json',
    success: function load(d) {
        var perimetro = L.geoJson(d).addTo(map);
      }
    });


// funzione per I FILTRI

$('#search').keyup(search);
function search() {
    // get the value of the search input field
    //    var searchString = $('#search').val().toLowerCase();
    var searchString = $('#search').val();

    cbData.setFilter(showComune);

    // here we're simply comparing the 'state' property of each marker
    // to the search string, seeing whether the former contains the latter.
    function showComune(feature) {
        return feature.properties.Comune
            .toLowerCase()
            .search(searchString) !== -1;
    }
}


// Funzione per la MODALE
cbData.on('click', function(e) {
  // Force close the popup.// ma in realtà c'è un display none perché Leaflet non consente di disabilitare il popup...
  e.layer.closePopup();

  var feature = e.layer.feature;
  var title = feature.properties.Titolo;
  var place = feature.properties.Comune;
  var beniconfiscati = feature.properties.BeniConfiscati;
  var beniriusati = feature.properties.BeniRiutilizzati;
  var content = feature.properties.Descrizione;
  var autori = feature.properties.Autori;
  var media = feature.properties.UrlMedia;

  // Modal Content
  $("#marker_title").html(title);
  $("#marker_place").html("<span><i class='fa fa-map-marker' aria-hidden='true'></i> " + place + "<br></span><span><i class='fa fa-home' aria-hidden='true'></i> Beni confiscati: " + beniconfiscati + "</span><br><span> <i class='fa fa-repeat' aria-hidden='true'></i> Beni riusati: "+ beniriusati + "</span>");
  $("#marker_content").html("<span class='byline'>" + autori + "</span><br><br>" + content);
//  $("#marker_contacts").html("<i class='fa fa-address-card' aria-hidden='true'></i> " + email + " | " + website);
  $("#marker_media").html(media);
  $('#exampleModal').modal('show');
});
