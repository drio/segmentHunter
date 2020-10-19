import mapboxgl from "mapbox-gl";
import alg from "../../logic/algorithm";
import { Segment } from "../../logic/types";

let storedBounds: mapboxgl.LngLatBounds;

export function saveBounds(bounds: mapboxgl.LngLatBounds): void {
  storedBounds = bounds;
}

function genGeoJSONSymbol(coordinates: number[]): mapboxgl.GeoJSONSourceRaw {
  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates,
          },
        },
      ],
    },
  };
}

function genLayerSymbol(id: string, field: string): mapboxgl.Layer {
  return {
    id,
    type: "symbol",
    source: id,
    layout: {
      "text-field": field,
      visibility: "visible",
    },
  };
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
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinateList,
          },
        },
      ],
    },
  });
  const score = segment.map ? alg.score(segment, windAngle) : 0;
  map.addLayer({
    id: id,
    type: "line",
    source: id,
    layout: {},
    paint: {
      "line-opacity": 0.8,
      "line-width": 6,
      "line-color": computeScoreColor(score),
    },
  });

  const startId = `start-${segment.id}`;
  map.addSource(startId, genGeoJSONSymbol(coordinateList[0]));
  map.addLayer(genLayerSymbol(startId, "▶︎"));

  const stopId = `stop-${segment.id}`;
  map.addSource(
    stopId,
    genGeoJSONSymbol(coordinateList[coordinateList.length - 1])
  );
  map.addLayer(genLayerSymbol(stopId, "■"));
}

function computeScoreColor(score: number) {
  if (score < 25) return "lightgrey";
  else if (score < 50) return "#f9d5e5";
  else if (score < 75) return " #bd5734";
  return "red";
}

export function renderSegments(
  map: mapboxgl.Map,
  segments: Segment[],
  windAngle: number
): void {
  segments.forEach((s) => {
    s.map && addLine(map, s, windAngle);
  });
}

export function colorSegments(
  segments: Segment[],
  map: mapboxgl.Map,
  windAngle: number
): void {
  segments.forEach((s) => {
    if (s.map) {
      const score = alg.score(s, windAngle);
      const color = computeScoreColor(score);
      map.setPaintProperty(`segment-${s.id}`, "line-color", color);
    }
  });
}

export function segmentSelected(
  map: mapboxgl.Map,
  selectedSegment: Segment | null
): void {
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
    if (storedBounds) map.fitBounds(storedBounds);
  }
}
