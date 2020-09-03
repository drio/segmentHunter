import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import mapboxgl from "mapbox-gl";
import alg from "../logic/algorithm";

const TOKEN = process.env.MAPBOX_TOKEN;
const DEFAULT_ZOOM = 11;

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

function colorSegments(segments, map, windDirection) {
  segments.forEach(s => {
    const score = alg.score(s, windDirection);
    const color = computeScoreColor(score);
    map.setPaintProperty(`segment-${s.id}`, "line-color", color);
  });
}

let map;

const DEFAULT_STATE = {
  lng: 2.078728 /* Barcelona, Spain */,
  lat: 41.3948976,
  zoom: 1
};

function Map({ segments, windDirection, localCoordinates, onCenterUpdate }) {
  const mapContainer = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [state, setState] = useState(
    localCoordinates
      ? {
          lng: localCoordinates.longitude,
          lat: localCoordinates.latitude,
          zoom: DEFAULT_ZOOM
        }
      : DEFAULT_STATE
  );

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [state.lng, state.lat],
      zoom: state.zoom
    });

    map.on(
      "render",
      debounce(() => {
        const { lat, lng } = map.getCenter();
        onCenterUpdate({ latitude: lat, longitude: lng });
      }, 30)
    );

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
    if (mapLoaded) colorSegments(segments, map, windDirection);
  }, [windDirection, mapLoaded]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={mapContainer} className="mapContainer" />
    </div>
  );
}

export default Map;
