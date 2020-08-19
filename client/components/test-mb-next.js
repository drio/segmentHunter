import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import polyline from "@mapbox/polyline";
import * as turf from "@turf/turf";

const TOKEN =
  "pk.eyJ1IjoiZHJpbyIsImEiOiJjanhrczh2c2MyNnVmNDBwNm1ic2NhZTVsIn0.X9AIabxzpa8DYz3D7W0wiQ";

const PATRIOTS_SOUTH_NORTH = "1525260";
const PATRIOTS_NORTH_SOUTH = "1920971";
const BRIDGE_MT_SIDE = "652664";
const LIMEHOUSE_NORTH_SOUTH = "752447";

mapboxgl.accessToken = TOKEN;

/*
  WARNING: the input points have to be in the format [longitude, latitude]
 */
function computeDistance(from, to) {
  const distance = turf.distance(turf.point(from), turf.point(to), {
    units: "kilometers"
  });
  return distance;
}

function computeAngle(p1, p2) {
  const [lon1, lat1] = p1;
  const [lon2, lat2] = p2;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let brng = Math.atan2(y, x);
  brng = brng * (180 / Math.PI);
  brng = (brng + 360) % 360;
  brng = 360 - brng; // count degrees counter-clockwise - remove to make clockwise

  return brng;
}

function addMarker(map, segment, setMarker) {
  const {
    start_longitude,
    start_latitude,
    end_latitude,
    end_longitude
  } = segment;
  setMarker(
    new mapboxgl.Marker({ color: "green" })
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

function test(segment) {
  const coordinateList = polyline
    .decode(segment.map.polyline)
    .map(p => [p[1], p[0]]); // reverse lat/long

  let prev = null;
  const distance = [];
  const angles = [];
  coordinateList.forEach(p => {
    if (prev) {
      distance.push(computeDistance(prev, p));
      angles.push(computeAngle(prev, p));
    }
    prev = p;
  });
  console.log(angles);
}

function Map({ segments }) {
  const concreteSegment = segments.filter(
    s => s.id == LIMEHOUSE_NORTH_SOUTH
  )[0];
  const mapContainer = useRef(null);

  const [state, setState] = useState({
    lng: concreteSegment.start_longitude,
    lat: concreteSegment.start_latitude,
    zoom: 14
  });

  const [marker, setMarker] = useState(null);

  test(concreteSegment);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [state.lng, state.lat],
      zoom: state.zoom
    });

    map.on("load", () => {
      [concreteSegment].forEach(s => {
        addMarker(map, s, setMarker);
        addLine(map, s);
      });
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
