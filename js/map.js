var apiKey = "pk.eyJ1IjoibmVsc29ubWF1IiwiYSI6ImNqNnhhNXFrMzFyZTEyeGxwcmd2Z2J2dHQifQ.vIgELGdEcZ6EMTDKIXcWMg";
L.mapbox.accessToken = apiKey;

var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([40, 9], 8);

// carico i dati e li aggiungo sulla mappa
// dati da https://docs.google.com/spreadsheets/d/1xnVi1UjRAd50idDmXtKcYv-UxNWAE-rHL8qJeF3ef5o/edit#gid=0
var gsheetSource = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRj_8QPjxAq9VDaTvU1xbR9ZSJls4pLY9jN0itafpMuqXgMT05oGNHeGG8bab1cTZF7_G_dL57AvB49/pub?gid=0&single=true&output=csv';
var cbData = omnivore.csv(gsheetSource, null, L.mapbox.featureLayer()).addTo(map);

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
