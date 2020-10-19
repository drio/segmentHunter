import React from "react";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import mapboxgl from "mapbox-gl";
import { Segment, Coordinate } from "../../logic/types";
import {
  saveBounds,
  renderSegments,
  colorSegments,
  segmentSelected,
} from "./logic";

const TOKEN = process.env.MAPBOX_TOKEN;
const DEFAULT_ZOOM = 11;

const DEFAULT_STATE = {
  lng: 2.078728 /* Barcelona, Spain */,
  lat: 41.3948976,
  zoom: 1,
};

if (TOKEN) {
  mapboxgl.accessToken = TOKEN;
}

let map: mapboxgl.Map;

interface MapProps {
  segments: Segment[];
  windAngle: number;
  onCenterUpdate: (c: Coordinate) => void;
  location: Coordinate | null;
  selectedSegment: Segment | null;
}

function Map(props: MapProps): JSX.Element {
  const {
    segments = [],
    windAngle,
    onCenterUpdate,
    location,
    selectedSegment,
  } = props;

  const state = location
    ? {
        lng: location.longitude,
        lat: location.latitude,
        zoom: DEFAULT_ZOOM,
      }
    : DEFAULT_STATE;
  const mapContainer = useRef<string | HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [segmentsLoaded, setSegmentsLoaded] = useState(false);

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [state.lng, state.lat],
      zoom: state.zoom,
    });

    map.on(
      "render",
      debounce(() => {
        const { lat, lng } = map.getCenter();
        onCenterUpdate({ latitude: lat, longitude: lng });
      }, 30)
    );

    map.on("load", () => {
      setMapLoaded(true);
      saveBounds(map.getBounds());
      const { lng, lat } = state;
      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    });
  }, []);

  useEffect(() => {
    if (mapLoaded && !segmentsLoaded) {
      renderSegments(map, segments, windAngle);
      setSegmentsLoaded(true);
    }
    if (mapLoaded && segmentsLoaded) colorSegments(segments, map, windAngle);
  }, [windAngle, mapLoaded]);

  useEffect(() => segmentSelected(map, selectedSegment), [selectedSegment]);

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
