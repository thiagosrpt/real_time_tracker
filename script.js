var markers = [];
stations = pathStations.stations;

function run() {
  refreshMarkers();
  stations.forEach(async function (station) {
    //gets station status
    let stationStatus = await getPathStations(station.station.toLowerCase());

    // creates marker popup with details from get station status
    let html = getHtmlDetails(stationStatus);
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `
        <h3>${station.name}</h3>
        ${html}
        `
    );

    // creates the marker and popup
    marker = new mapboxgl.Marker()
      .setLngLat([station.coordinates.longitude, station.coordinates.latitude])
      .setPopup(popup)
      .addTo(map);

    markers.push(marker);
  });
}

function refreshMarkers() {
  markers.forEach((marker) => {
    marker.remove();
  });
}

//returns HTML for popups
function getHtmlDetails(stationStatus) {
  let html = "";

  stationStatus.forEach((item) => {
    var headsign = item["headsign"];
    var status = item.status.toLowerCase();
    status = status.replace("_", " ");
    var projectedArrival = item["projectedArrival"];
    const eta = new Date(projectedArrival).toLocaleTimeString(undefined, {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "numeric",
    });

    html =
      html +
      `
    <hr>
    <p>
      <span>
        To: ${headsign}<br>
        Status: ${status}<br>
        ETA: ${eta}<br>
      </span>
    </p>
    `;
  });

  return html;
}

async function getPathStations(station) {
  const url = `https://path.api.razza.dev/v1/stations/${station}/realtime`;
  const response = await fetch(url);
  const json = await response.json();
  return json.upcomingTrains;
}

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhpYWdvc3JwdCIsImEiOiJjbDVnNWdjb2IxNnF5M2pudHoyZzFvbGxvIn0.VyGTgv1AGc4I3gNVzfroOQ";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-74.06289, 40.73301],
  zoom: 12,
});

run();
