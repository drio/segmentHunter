import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import polyline from "@mapbox/polyline";

const TOKEN =
  "pk.eyJ1IjoiZHJpbyIsImEiOiJjanhrczh2c2MyNnVmNDBwNm1ic2NhZTVsIn0.X9AIabxzpa8DYz3D7W0wiQ";

mapboxgl.accessToken = TOKEN;

function addMarker(map, segment, setMarker) {
  const {
    start_longitude,
    start_latitude,
    end_latitude,
    end_longitude
  } = segment;
  setMarker(
    new mapboxgl.Marker({})
      .setLngLat([start_longitude, start_latitude])
      .addTo(map)
  );
  setMarker(
    new mapboxgl.Marker({ color: "red" })
      .setLngLat([end_longitude, end_latitude])
      .addTo(map)
  );
}

function addLine(map, segment) {
  const coordinateList = polyline
    .decode(segment.map.polyline)
    .map(p => [p[1], p[0]]); // reverse lat/long
  const id = `segment-${segment.id}`;
  console.log(coordinateList);
  map.addSource(id, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            color: "#F7455D" // red
          },
          geometry: {
            type: "LineString",
            coordinates: coordinateList
          }
        }
      ]
    }
  });

  map.addLayer({
    id: id,
    type: "line",
    source: id,
    paint: {
      "line-width": 4,
      // Use a get expression
      // (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
      // to set the line-color to a feature property value.
      "line-color": ["get", "color"]
    }
  });
}

function Map({ segments }) {
  const concreteSegment = segments[24];
  const mapContainer = useRef(null);

  const [state, setState] = useState({
    lng: concreteSegment.start_longitude,
    lat: concreteSegment.start_latitude,
    zoom: 14
  });

  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [state.lng, state.lat],
      zoom: state.zoom
    });

    map.on("load", () => {
      if (!marker) {
        addMarker(map, concreteSegment, setMarker);
      }
      addLine(map, concreteSegment);
    });

    map.on("move", () => {
      setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }, []);

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {state.lng} | Latitude: {state.lat} | Zoom: {state.zoom}
        </div>
      </div>
      <div ref={mapContainer} className="mapContainer" />
    </div>
  );
}

export default Map;
