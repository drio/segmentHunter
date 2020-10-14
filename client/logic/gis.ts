import * as turf from "@turf/turf";
import { Coordinate, Segment } from "./types";

const MAX_DIST = 50; // km

/* filter segments that are within MAX_DIST */
function onlyCloseSegments(
  location: Coordinate | null,
  segments: Segment[] | null
): Segment[] {
  if (!segments || !location) return [];

  const { latitude, longitude } = location;

  if (latitude && longitude) {
    return segments.filter((s) => {
      const {
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
      } = s;
      const from = turf.point([longitude, latitude]);
      const start = turf.point([start_longitude, start_latitude]);
      const end = turf.point([end_longitude, end_latitude]);
      return (
        turf.distance(from, start) < MAX_DIST &&
        turf.distance(from, end) < MAX_DIST
      );
    });
  }

  return segments;
}

function onlySegmentsInBB(segments: Segment[], bbox: turf.BBox): Segment[] {
  const polyBB = turf.bboxPolygon(bbox);
  const inBB = segments.filter((s) => {
    const segmentStartPoint = turf.point([s.start_longitude, s.start_latitude]);
    return turf.booleanPointInPolygon(segmentStartPoint, polyBB);
  });
  return inBB;
}

export { onlyCloseSegments, onlySegmentsInBB };
