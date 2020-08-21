import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import alg from "../logic/algorithm";

const TOKEN =
  "pk.eyJ1IjoiZHJpbyIsImEiOiJjanhrczh2c2MyNnVmNDBwNm1ic2NhZTVsIn0.X9AIabxzpa8DYz3D7W0wiQ";

const PATRIOTS_SOUTH_NORTH = "1525260";
const PATRIOTS_NORTH_SOUTH = "1920971";
const BRIDGE_MT_SIDE = "652664";
const LIMEHOUSE_NORTH_SOUTH = "752447";
const BRIDGE_W_E = "1670236";

mapboxgl.accessToken = TOKEN;

function addMarker(map, segment, setMarker) {
  const {
    start_longitude,
    start_latitude,
    end_latitude,
    end_longitude
  } = segment;
  setMarker(
    new mapboxgl.Marker({ color: "green", scale: 0.5 })
      .setLngLat([start_longitude, start_latitude])
      .addTo(map)
  );
  setMarker(
    new mapboxgl.Marker({ color: "red", scale: 0.5 })
      .setLngLat([end_longitude, end_latitude])
      .addTo(map)
  );
}

function addLine(map, segment) {
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

  map.addLayer({
    id: id,
    type: "line",
    source: id,
    paint: {
      "line-width": 4,
      "line-color": ["get", "color"]
    }
  });

  map.on("click", id, () => {
    console.log("click: ", segment.name, alg.score(segment, "SE"));
  });
}

function Map({ segments, weather }) {
  const concreteSegment = segments.filter(s => s.id == BRIDGE_W_E)[0];
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
      segments.forEach(s => {
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
