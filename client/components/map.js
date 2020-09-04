import React from "react";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import mapboxgl from "mapbox-gl";
import alg from "../logic/algorithm";

const TOKEN = process.env.MAPBOX_TOKEN;
const DEFAULT_ZOOM = 11;

mapboxgl.accessToken = TOKEN;

function addLine(map, segment, windAngle) {
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

  const score = alg.score(segment, windAngle);

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

function renderSegments(map, segments, windAngle) {
  segments.forEach(s => {
    addLine(map, s, windAngle);
  });
}

function computeScoreColor(score) {
  if (score < 25) return "lightgrey";
  else if (score < 50) return "#f9d5e5";
  else if (score < 75) return " #bd5734";
  return "red";
}

function colorSegments(segments, map, windAngle) {
  segments.forEach(s => {
    const score = alg.score(s, windAngle);
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

function Map(props) {
  const segments = props.segments || [];
  const windAngle = props.windAngle || 0;
  const onCenterUpdate = props.onCenterUpdate || (() => null);
  const localCoordinates = props.localCoordinates || {};

  const [state, setState] = useState(
    localCoordinates.longitude && localCoordinates.latitude
      ? {
          lng: localCoordinates.longitude,
          lat: localCoordinates.latitude,
          zoom: DEFAULT_ZOOM
        }
      : DEFAULT_STATE
  );
  const mapContainer = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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
        const [se, ne] = map.getBounds().toArray();
        onCenterUpdate({ latitude: lat, longitude: lng }, [...se, ...ne]);
      }, 30)
    );

    map.on("load", () => {
      renderSegments(map, segments, windAngle);
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
    if (mapLoaded) colorSegments(segments, map, windAngle);
  }, [windAngle, mapLoaded]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={mapContainer} className="mapContainer" />
    </div>
  );
}

export default Map;
