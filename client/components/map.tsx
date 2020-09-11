import React from "react";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import mapboxgl from "mapbox-gl";
import alg from "../logic/algorithm";
import { Segment, Coordinate } from "../logic/types";

const TOKEN = process.env.MAPBOX_TOKEN;
const DEFAULT_ZOOM = 11;

if (TOKEN) {
  mapboxgl.accessToken = TOKEN;
}

function addLine(map: mapboxgl.Map, segment: Segment, windAngle: number) {
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
            color: "#F7455D", // red
          },
          geometry: {
            type: "LineString",
            coordinates: coordinateList,
          },
        },
      ],
    },
  });

  const score = alg.score(segment, windAngle);

  map.addLayer({
    id: id,
    type: "line",
    source: id,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-opacity": 0.8,
      "line-width": 6,
      "line-color": computeScoreColor(score),
    },
  });

  map.on("click", id, () => {
    console.log("click: ", segment.name, score);
  });
}

function renderSegments(
  map: mapboxgl.Map,
  segments: Segment[],
  windAngle: number
) {
  segments.forEach((s) => {
    addLine(map, s, windAngle);
  });
}

function computeScoreColor(score: number) {
  if (score < 25) return "lightgrey";
  else if (score < 50) return "#f9d5e5";
  else if (score < 75) return " #bd5734";
  return "red";
}

function colorSegments(
  segments: Segment[],
  map: mapboxgl.Map,
  windAngle: number
) {
  segments.forEach((s) => {
    const score = alg.score(s, windAngle);
    const color = computeScoreColor(score);
    map.setPaintProperty(`segment-${s.id}`, "line-color", color);
  });
}

let map: mapboxgl.Map, savedBounds: mapboxgl.LngLatBounds;

const DEFAULT_STATE = {
  lng: 2.078728 /* Barcelona, Spain */,
  lat: 41.3948976,
  zoom: 1,
};

interface MapProps {
  segments: Segment[];
  windAngle: number;
  onCenterUpdate: (c: Coordinate) => void;
  localCoordinates: Coordinate | null;
  selectedSegment: Segment | null;
}

function Map(props: MapProps): JSX.Element {
  const {
    segments = [],
    windAngle = 0,
    onCenterUpdate,
    localCoordinates,
    selectedSegment,
  } = props;

  const [state, setState] = useState(
    localCoordinates
      ? {
          lng: localCoordinates.longitude,
          lat: localCoordinates.latitude,
          zoom: DEFAULT_ZOOM,
        }
      : DEFAULT_STATE
  );
  const mapContainer = useRef<string | HTMLElement>("");
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer ? mapContainer.current : "",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [state.lng, state.lat],
      zoom: state.zoom,
    });

    map.on(
      "render",
      debounce(() => {
        const { lat, lng } = map.getCenter();
        /*const [se, ne] = map.getBounds().toArray();*/
        onCenterUpdate({ latitude: lat, longitude: lng });
      }, 30)
    );

    map.on("load", () => {
      renderSegments(map, segments, windAngle);
      setMapLoaded(true);
      savedBounds = map.getBounds();
    });

    map.on("move", () => {
      setState({
        lng: map.getCenter().lng,
        lat: map.getCenter().lat,
        zoom: map.getZoom(),
      });
    });
  }, []);

  useEffect(() => {
    if (mapLoaded) colorSegments(segments, map, windAngle);
  }, [windAngle, mapLoaded]);

  useEffect(() => {
    if (selectedSegment) {
      const {
        start_latitude,
        end_latitude,
        start_longitude,
        end_longitude,
      } = selectedSegment;
      map.fitBounds([
        [start_longitude, start_latitude],
        [end_longitude, end_latitude],
      ]);
    } else {
      if (savedBounds) map.fitBounds(savedBounds);
    }
  }, [selectedSegment]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        ref={mapContainer as React.RefObject<HTMLDivElement>}
        className="mapContainer"
      />
    </div>
  );
}

export default Map;
