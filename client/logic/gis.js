import * as turf from "@turf/turf";

const MAX_DIST = 50; // km

export default function onlyLocalSegments({ latitude, longitude }, segments) {
  return segments.filter(s => {
    const { start_latitude, start_longitude, end_latitude, end_longitude } = s;
    const from = turf.point([longitude, latitude]);
    const start = turf.point([start_longitude, start_latitude]);
    const end = turf.point([end_longitude, end_latitude]);
    return (
      turf.distance(from, start) < MAX_DIST &&
      turf.distance(from, end) < MAX_DIST
    );
  });
}
