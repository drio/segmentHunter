import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import alg from "../logic/algorithm";

const TOKEN = process.env.MAPBOX_TOKEN;

const PATRIOTS_SOUTH_NORTH = "1525260";
const PATRIOTS_NORTH_SOUTH = "1920971";
const BRIDGE_MT_SIDE = "652664";
const LIMEHOUSE_NORTH_SOUTH = "752447";
const BRIDGE_W_E = "1670236";

mapboxgl.accessToken = TOKEN;

function addMarker(map, segment) {
  const {
    start_longitude,
    start_latitude,
    end_latitude,
    end_longitude
  } = segment;

  new mapboxgl.Marker({ color: "green", scale: 0.5 })
    .setLngLat([start_longitude, start_latitude])
    .addTo(map);

  new mapboxgl.Marker({ color: "red", scale: 0.5 })
    .setLngLat([end_longitude, end_latitude])
    .addTo(map);
}

function addLine(map, segment, windDirection) {
  const coordinateList = alg.polyToCoordinates(segment.map.polyline);

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

  const score = alg.score(segment, windDirection);

  map.addLayer({
    id: id,
    type: "line",
    source: id,
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-opacity": 0.8,
      "line-width": 6,
      "line-color": computeScoreColor(score)
    }
  });

  map.on("click", id, () => {
    console.log("click: ", segment.name, score);
  });
}

function renderSegments(map, segments, windDirection) {
  segments.forEach(s => {
    //addMarker(map, s);
    addLine(map, s, windDirection);
  });
}

function computeScoreColor(score) {
  if (score < 25) return "lightgrey";
  else if (score < 50) return "#f9d5e5";
  else if (score < 75) return " #bd5734";
  return "red";
}

let map;

function Map({ segments, weather, windDirection }) {
  const concreteSegment = segments.filter(s => s.id == BRIDGE_W_E)[0];
  const mapContainer = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [state, setState] = useState({
    lng: concreteSegment.start_longitude,
    lat: concreteSegment.start_latitude,
    zoom: 14
  });

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [state.lng, state.lat],
      zoom: state.zoom
    });

    map.on("load", () => {
      renderSegments(map, segments, windDirection);
      setMapLoaded(true);
    });

    map.on("move", () => {
      setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      segments.forEach(s => {
        const score = alg.score(s, windDirection);
        const color = computeScoreColor(score);
        map.setPaintProperty(`segment-${s.id}`, "line-color", color);
      });
    }
  }, [windDirection]);

  return (
    <div>
      {/*
      <div className="sidebarStyle">
        <div>
          Longitude: {state.lng} | Latitude: {state.lat} | Zoom: {state.zoom}
        </div>
      </div>
      */}
      <div ref={mapContainer} className="mapContainer" />
    </div>
  );
}

export default Map;