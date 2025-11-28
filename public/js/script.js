// =====================
// Bootstrap Form Validation
// =====================
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  
  const forms = document.querySelectorAll('.needs-validation');
  
  Array.prototype.slice.call(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
});

// =====================
// Google Maps Initialization
// =====================
function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return; // Only run if #map exists on the page

  // Coordinates are passed as a global variable from EJS
  const coordinates = window.coordinates || [0, 0]; // [lng, lat]
  const location = { lat: coordinates[1] || 0, lng: coordinates[0] || 0 };

  const map = new google.maps.Map(mapElement, {
    zoom: 12,
    center: location,
  });

  new google.maps.Marker({
    position: location,
    map: map,
  });
}

// If you want to load the map dynamically, call initMap in your EJS like:
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=<%= mapApiKey %>&callback=initMap"></script>
