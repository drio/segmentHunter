import * as turf from "@turf/turf";

function processSegments({ latitude, longitude }, segments) {
  const MAX_DIST = 50; // km
  const localSegments = segments.filter(s => {
    const { start_latitude, start_longitude, end_latitude, end_longitude } = s;
    const from = turf.point([longitude, latitude]);
    const start = turf.point([start_longitude, start_latitude]);
    const end = turf.point([end_longitude, end_latitude]);
    return (
      turf.distance(from, start) < MAX_DIST &&
      turf.distance(from, end) < MAX_DIST
    );
  });

  return localSegments.length > 0 ? localSegments : segments;
}

function onlySegmentsInBB(segments, bbox) {
  const polyBB = turf.bboxPolygon(bbox);
  const inBB = segments.filter(s => {
    const segmentStartPoint = turf.point([s.start_longitude, s.start_latitude]);
    return turf.booleanPointInPolygon(segmentStartPoint, polyBB);
  });
  return inBB;
}

export { onlySegmentsInBB };
